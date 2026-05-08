/**
 * Portfolio chatbot POC.
 *
 * Run from the repo root:
 *
 *   bun docs/openrouter-chatbot.poc.ts
 *
 * This file demonstrates the complete flow intended for the Astro feature:
 *
 * - Load OPENROUTER_API_KEY from .env-style files.
 * - Load src/data/chat-instructions.md as the assistant behavior contract.
 * - Load src/data/chat-context.md as the assistant's grounded knowledge source.
 * - Keep multiple chats in a sessionStorage-compatible store.
 * - Create chats, switch chats, and ask follow-up questions.
 * - Send only the active chat's bounded message history to OpenRouter.
 * - Stream assistant output via the Vercel AI SDK.
 * - Use deepseek/deepseek-v4-flash with medium reasoning.
 * - Give the model tightly instructed access to OpenRouter server-side web_search and web_fetch tools.
 *
 * This is a POC file, not production UI code. In production, the requestOpenRouterStream
 * function belongs in src/pages/api/chat.ts and the ChatSessionStore shape belongs in
 * the browser client code backed by window.sessionStorage.
 */

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

type Role = "user" | "assistant";
type MessageStatus = "complete" | "streaming" | "error";

type StoredMessage = {
  id: string;
  role: Role;
  content: string;
  status: MessageStatus;
  createdAt: string;
};

type StoredChat = {
  id: string;
  title: string;
  messages: StoredMessage[];
  createdAt: string;
  updatedAt: string;
};

type StoredChatState = {
  version: 1;
  activeChatId: string;
  chats: StoredChat[];
};

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const STORAGE_KEY = "polarzero.chat.v1";
const DEFAULT_MODEL = "deepseek/deepseek-v4-flash";
const DEFAULT_REASONING_EFFORT = "medium";
const DEFAULT_MAX_OUTPUT_TOKENS = 1_000;
const SITE_URL = "https://polarzero.xyz";
const SITE_TITLE = "polarzero";
const MAX_CHATS = 10;
const MAX_MESSAGES_PER_CHAT = 24;
const SERVER_MESSAGE_WINDOW = 12;
const SERVER_MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_STORED_MESSAGE_CHARS = 8_000;
const MAX_SERIALIZED_STORAGE_BYTES = 1_000_000;
const STREAM_PERSIST_INTERVAL_MS = 300;

let cachedChatInstructions: string | undefined;
let cachedChatContext: string | undefined;

class MemoryStorage implements StorageLike {
  #values = new Map<string, string>();

  getItem(key: string) {
    return this.#values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.#values.set(key, value);
  }

  removeItem(key: string) {
    this.#values.delete(key);
  }
}

class ChatSessionStore {
  #state: StoredChatState;
  #pendingPersistTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly storage: StorageLike) {
    this.#state = this.#load();
  }

  get state() {
    return structuredClone(this.#state);
  }

  get activeChat() {
    const chat = this.#state.chats.find((candidate) => candidate.id === this.#state.activeChatId);

    if (!chat) {
      throw new Error("Active chat is missing.");
    }

    return chat;
  }

  createChat() {
    const now = new Date().toISOString();
    const chat: StoredChat = {
      id: crypto.randomUUID(),
      title: "New chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    this.#state.chats.unshift(chat);
    this.#state.activeChatId = chat.id;
    this.#persist();

    return chat.id;
  }

  switchChat(chatId: string) {
    if (!this.#state.chats.some((chat) => chat.id === chatId)) {
      throw new Error(`Unknown chat: ${chatId}`);
    }

    this.#state.activeChatId = chatId;
    this.#persist();
  }

  deleteChat(chatId: string) {
    this.#state.chats = this.#state.chats.filter((chat) => chat.id !== chatId);

    if (!this.#state.chats.length) {
      this.createChat();
      return;
    }

    if (this.#state.activeChatId === chatId) {
      const [nextChat] = [...this.#state.chats].sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt),
      );
      this.#state.activeChatId = nextChat.id;
    }

    this.#persist();
  }

  clearAll() {
    this.storage.removeItem(STORAGE_KEY);
    this.#state = this.#createInitialState();
    this.#persist();
  }

  addUserMessage(content: string) {
    const chat = this.activeChat;
    const message = this.#createMessage("user", content.trim(), "complete");

    chat.messages.push(message);
    chat.updatedAt = message.createdAt;

    if (chat.title === "New chat") {
      chat.title = titleFromFirstMessage(message.content);
    }

    this.#persist();
    return message;
  }

  startAssistantMessage() {
    const chat = this.activeChat;
    const message = this.#createMessage("assistant", "", "streaming");

    chat.messages.push(message);
    chat.updatedAt = message.createdAt;
    this.#persist();

    return message.id;
  }

  appendAssistantChunk(messageId: string, chunk: string) {
    const chat = this.activeChat;
    const message = chat.messages.find((candidate) => candidate.id === messageId);

    if (!message || message.role !== "assistant") {
      throw new Error(`Unknown assistant message: ${messageId}`);
    }

    message.content = `${message.content}${chunk}`.slice(0, MAX_STORED_MESSAGE_CHARS);
    message.status = "streaming";
    chat.updatedAt = new Date().toISOString();
    this.#schedulePersist();
  }

  completeAssistantMessage(messageId: string) {
    this.#setAssistantStatus(messageId, "complete");
  }

  failAssistantMessage(messageId: string, fallbackContent: string) {
    const chat = this.activeChat;
    const message = chat.messages.find((candidate) => candidate.id === messageId);

    if (!message || message.role !== "assistant") {
      throw new Error(`Unknown assistant message: ${messageId}`);
    }

    message.content = message.content
      ? `${message.content}\n\n[Response interrupted.]`
      : fallbackContent;
    message.status = "error";
    chat.updatedAt = new Date().toISOString();
    this.#persist();
  }

  boundedActiveMessages() {
    return this.activeChat.messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .filter((message) => message.content.trim())
      .slice(-SERVER_MESSAGE_WINDOW)
      .map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content.slice(0, MAX_MESSAGE_CHARS),
        createdAt: message.createdAt,
      }));
  }

  #setAssistantStatus(messageId: string, status: MessageStatus) {
    const chat = this.activeChat;
    const message = chat.messages.find((candidate) => candidate.id === messageId);

    if (!message || message.role !== "assistant") {
      throw new Error(`Unknown assistant message: ${messageId}`);
    }

    message.status = status;
    chat.updatedAt = new Date().toISOString();
    this.#persist();
  }

  #schedulePersist() {
    if (this.#pendingPersistTimer) {
      return;
    }

    this.#pendingPersistTimer = setTimeout(() => {
      this.#pendingPersistTimer = undefined;
      this.#persist();
    }, STREAM_PERSIST_INTERVAL_MS);
  }

  #createMessage(role: Role, content: string, status: MessageStatus): StoredMessage {
    return {
      id: crypto.randomUUID(),
      role,
      content: content.slice(0, MAX_STORED_MESSAGE_CHARS),
      status,
      createdAt: new Date().toISOString(),
    };
  }

  #load(): StoredChatState {
    const raw = this.storage.getItem(STORAGE_KEY);

    if (!raw) {
      return this.#createInitialState();
    }

    try {
      const parsed = JSON.parse(raw) as StoredChatState;

      const normalized = normalizeStoredChatState(parsed);

      if (!normalized) {
        return this.#createInitialState();
      }

      return normalized;
    } catch {
      return this.#createInitialState();
    }
  }

  #createInitialState(): StoredChatState {
    const now = new Date().toISOString();
    const chat: StoredChat = {
      id: crypto.randomUUID(),
      title: "New chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    return {
      version: 1,
      activeChatId: chat.id,
      chats: [chat],
    };
  }

  #persist() {
    if (this.#pendingPersistTimer) {
      clearTimeout(this.#pendingPersistTimer);
      this.#pendingPersistTimer = undefined;
    }

    this.#state.chats = this.#state.chats.map((chat) => ({
      ...chat,
      messages: chat.messages.slice(-MAX_MESSAGES_PER_CHAT).map((message) => ({
        ...message,
        content: message.content.slice(0, MAX_STORED_MESSAGE_CHARS),
      })),
    }));

    while (this.#state.chats.length > MAX_CHATS) {
      const oldestNonActive = [...this.#state.chats]
        .filter((chat) => chat.id !== this.#state.activeChatId)
        .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))[0];

      if (!oldestNonActive) {
        break;
      }

      this.#state.chats = this.#state.chats.filter((chat) => chat.id !== oldestNonActive.id);
    }

    let serialized = JSON.stringify(this.#state);

    while (byteLength(serialized) > MAX_SERIALIZED_STORAGE_BYTES && this.#state.chats.length > 1) {
      const oldestNonActive = [...this.#state.chats]
        .filter((chat) => chat.id !== this.#state.activeChatId)
        .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))[0];

      if (!oldestNonActive) {
        break;
      }

      this.#state.chats = this.#state.chats.filter((chat) => chat.id !== oldestNonActive.id);
      serialized = JSON.stringify(this.#state);
    }

    while (
      byteLength(serialized) > MAX_SERIALIZED_STORAGE_BYTES &&
      this.activeChat.messages.length > 1
    ) {
      this.activeChat.messages.shift();
      serialized = JSON.stringify(this.#state);
    }

    this.storage.setItem(STORAGE_KEY, serialized);
  }
}

const isIsoDateString = (value: unknown) =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

const normalizeStoredChatState = (value: unknown): StoredChatState | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Partial<StoredChatState>;

  if (candidate.version !== 1 || !Array.isArray(candidate.chats)) {
    return undefined;
  }

  const chats = candidate.chats
    .filter((chat): chat is StoredChat => Boolean(chat && typeof chat === "object"))
    .map((chat) => {
      const createdAt = isIsoDateString(chat.createdAt) ? chat.createdAt : new Date().toISOString();
      const updatedAt = isIsoDateString(chat.updatedAt) ? chat.updatedAt : createdAt;
      const messages = Array.isArray(chat.messages)
        ? chat.messages
            .filter((message): message is StoredMessage =>
              Boolean(
                message &&
                typeof message === "object" &&
                (message.role === "user" || message.role === "assistant") &&
                (message.status === "complete" ||
                  message.status === "streaming" ||
                  message.status === "error") &&
                typeof message.content === "string" &&
                isIsoDateString(message.createdAt),
              ),
            )
            .slice(-MAX_MESSAGES_PER_CHAT)
            .map((message) => ({
              id: typeof message.id === "string" ? message.id.slice(0, 128) : crypto.randomUUID(),
              role: message.role,
              content: message.content.slice(0, MAX_STORED_MESSAGE_CHARS),
              status: message.status,
              createdAt: message.createdAt,
            }))
        : [];

      return {
        id: typeof chat.id === "string" ? chat.id.slice(0, 128) : crypto.randomUUID(),
        title: typeof chat.title === "string" ? chat.title.slice(0, 80) : "New chat",
        messages,
        createdAt,
        updatedAt,
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, MAX_CHATS);

  if (!chats.length) {
    return undefined;
  }

  const activeChatId =
    typeof candidate.activeChatId === "string" &&
    chats.some((chat) => chat.id === candidate.activeChatId)
      ? candidate.activeChatId
      : chats[0].id;

  return {
    version: 1,
    activeChatId,
    chats,
  };
};

const titleFromFirstMessage = (content: string) => {
  const clean = content.trim().replace(/\s+/g, " ");
  return clean.length > 48 ? `${clean.slice(0, 48)}...` : clean || "New chat";
};

const byteLength = (value: string) => new TextEncoder().encode(value).byteLength;

const configuredModel = () => process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

const configuredReasoningEffort = () =>
  process.env.OPENROUTER_REASONING_EFFORT ?? DEFAULT_REASONING_EFFORT;

const configuredMaxOutputTokens = () => {
  const value = Number(process.env.OPENROUTER_MAX_OUTPUT_TOKENS);
  return Number.isInteger(value) && value > 0 ? value : DEFAULT_MAX_OUTPUT_TOKENS;
};

const loadEnv = async () => {
  for (const filename of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), filename);

    if (!existsSync(path)) {
      continue;
    }

    const source = await readFile(path, "utf8");

    for (const line of source.split("\n")) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const equalsIndex = trimmed.indexOf("=");

      if (equalsIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, equalsIndex).trim();
      const rawValue = trimmed.slice(equalsIndex + 1).trim();
      const value = rawValue.replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
};

const loadChatContext = async () => {
  if (cachedChatContext) {
    return cachedChatContext;
  }

  const path = resolve(process.cwd(), "src/data/chat-context.md");
  cachedChatContext = await readFile(path, "utf8");
  return cachedChatContext;
};

const loadChatInstructions = async () => {
  if (cachedChatInstructions) {
    return cachedChatInstructions;
  }

  const path = resolve(process.cwd(), "src/data/chat-instructions.md");
  cachedChatInstructions = await readFile(path, "utf8");
  return cachedChatInstructions;
};

type ServerMessage = ReturnType<ChatSessionStore["boundedActiveMessages"]>[number];

const validateServerRequest = (body: unknown) => {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid chat request.");
  }

  const { chatId, messages } = body as {
    chatId?: unknown;
    messages?: unknown;
  };

  if (typeof chatId !== "string" || !chatId || chatId.length > 128) {
    throw new Error("Invalid chatId.");
  }

  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array.");
  }

  if (messages.length > SERVER_MAX_MESSAGES) {
    throw new Error("Too many messages.");
  }

  if (!messages.length || messages[messages.length - 1]?.role !== "user") {
    throw new Error("The active chat must end with a user message.");
  }

  for (const message of messages) {
    if (!message || typeof message !== "object") {
      throw new Error("Invalid message.");
    }

    if (message.role !== "user" && message.role !== "assistant") {
      throw new Error("Invalid message role.");
    }

    if (typeof message.content !== "string") {
      throw new Error("Message content must be a string.");
    }

    if (!message.content.trim()) {
      throw new Error("Message content is required.");
    }

    if (message.content.length > MAX_MESSAGE_CHARS) {
      throw new Error("Message content exceeds the server limit.");
    }
  }

  return {
    chatId,
    messages: messages.slice(-SERVER_MESSAGE_WINDOW).map(
      (message): ServerMessage => ({
        id: typeof message.id === "string" ? message.id.slice(0, 128) : crypto.randomUUID(),
        role: message.role,
        content: message.content.slice(0, MAX_MESSAGE_CHARS),
        createdAt:
          typeof message.createdAt === "string" ? message.createdAt : new Date().toISOString(),
      }),
    ),
  };
};

async function requestOpenRouterStream(input: {
  apiKey: string;
  chatId: string;
  instructions: string;
  context: string;
  messages: ReturnType<ChatSessionStore["boundedActiveMessages"]>;
  onContent: (chunk: string) => void;
  onDone?: () => void;
  signal?: AbortSignal;
}) {
  const request = validateServerRequest({
    chatId: input.chatId,
    messages: input.messages,
  });

  const openrouter = createOpenRouter({
    apiKey: input.apiKey,
    appName: SITE_TITLE,
    appUrl: SITE_URL,
    compatibility: "strict",
  });

  const result = streamText({
    model: openrouter.chat(configuredModel()),
    system: `${input.instructions}\n\n# Knowledge document\n\n${input.context}`,
    messages: request.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    abortSignal: input.signal,
    maxOutputTokens: configuredMaxOutputTokens(),
    maxRetries: 2,
    providerOptions: {
      openrouter: {
        reasoning: {
          effort: configuredReasoningEffort(),
          exclude: true,
        },
        tools: [
          {
            type: "openrouter:web_search",
            parameters: {
              engine: "auto",
              max_results: 3,
              max_total_results: 5,
              search_context_size: "low",
            },
          },
          {
            type: "openrouter:web_fetch",
            parameters: {
              engine: "openrouter",
              max_uses: 3,
              max_content_tokens: 10_000,
              blocked_domains: ["localhost", "127.0.0.1", "0.0.0.0"],
            },
          },
        ],
      },
    },
  });

  for await (const chunk of result.textStream) {
    input.onContent(chunk);
  }

  input.onDone?.();
}

async function askActiveChat(
  store: ChatSessionStore,
  instructions: string,
  context: string,
  apiKey: string,
  question: string,
) {
  store.addUserMessage(question);
  const assistantMessageId = store.startAssistantMessage();

  process.stdout.write(`\n> ${question}\n\n`);

  try {
    await requestOpenRouterStream({
      apiKey,
      chatId: store.activeChat.id,
      instructions,
      context,
      messages: store.boundedActiveMessages(),
      onContent: (chunk) => {
        store.appendAssistantChunk(assistantMessageId, chunk);
        process.stdout.write(chunk);
      },
    });

    store.completeAssistantMessage(assistantMessageId);
    process.stdout.write("\n");
  } catch (error) {
    store.failAssistantMessage(
      assistantMessageId,
      "I could not reach the assistant right now. Please try again in a moment.",
    );
    throw error;
  }
}

async function main() {
  await loadEnv();

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in .env.local, .env, or the process environment.");
  }

  const instructions = await loadChatInstructions();
  const context = await loadChatContext();
  const store = new ChatSessionStore(new MemoryStorage());

  console.log(`Loaded chat instructions: ${instructions.length.toLocaleString()} characters`);
  console.log(`Loaded chat context: ${context.length.toLocaleString()} characters`);
  console.log(`Created initial chat: ${store.activeChat.id}`);

  await askActiveChat(
    store,
    instructions,
    context,
    apiKey,
    "What kind of work does polarzero do? Keep it concise.",
  );

  await askActiveChat(
    store,
    instructions,
    context,
    apiKey,
    "Follow up: which recent projects best demonstrate that?",
  );

  const firstChatId = store.activeChat.id;
  const secondChatId = store.createChat();
  console.log(`\nCreated second chat: ${secondChatId}`);

  await askActiveChat(
    store,
    instructions,
    context,
    apiKey,
    "Use web search or fetch only if useful: what is the current public GitHub URL for svvy, and what is it about?",
  );

  store.switchChat(firstChatId);
  console.log(`\nSwitched back to first chat: ${store.activeChat.title}`);
  console.log(`First chat message count: ${store.activeChat.messages.length}`);

  store.switchChat(secondChatId);
  store.deleteChat(firstChatId);
  console.log(`Deleted first chat. Remaining chats: ${store.state.chats.length}`);
}

await main();
