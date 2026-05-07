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
 * - Load src/data/chat-context.md as the assistant's grounded knowledge source.
 * - Keep multiple chats in a sessionStorage-compatible store.
 * - Create chats, switch chats, and ask follow-up questions.
 * - Send only the active chat's bounded message history to OpenRouter.
 * - Stream assistant output via the Vercel AI SDK.
 * - Use deepseek/deepseek-v4-flash with xhigh reasoning.
 * - Give the model access to OpenRouter server-side web_search and web_fetch tools.
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
const MODEL = "deepseek/deepseek-v4-flash";
const SITE_URL = "https://polarzero.xyz";
const SITE_TITLE = "polarzero";
const MAX_CHATS = 10;
const MAX_MESSAGES_PER_CHAT = 24;
const SERVER_MESSAGE_WINDOW = 12;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_STORED_MESSAGE_CHARS = 8_000;
const MAX_SERIALIZED_STORAGE_BYTES = 1_000_000;

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
    this.#persist();
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

      if (!isStoredChatState(parsed)) {
        return this.#createInitialState();
      }

      return parsed;
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

const isStoredChatState = (value: StoredChatState) =>
  value?.version === 1 &&
  typeof value.activeChatId === "string" &&
  Array.isArray(value.chats) &&
  value.chats.some((chat) => chat.id === value.activeChatId);

const titleFromFirstMessage = (content: string) => {
  const clean = content.trim().replace(/\s+/g, " ");
  return clean.length > 48 ? `${clean.slice(0, 48)}...` : clean || "New chat";
};

const byteLength = (value: string) => new TextEncoder().encode(value).byteLength;

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
  const path = resolve(process.cwd(), "src/data/chat-context.md");
  return readFile(path, "utf8");
};

const validateServerRequest = (
  chatId: string,
  messages: ReturnType<ChatSessionStore["boundedActiveMessages"]>,
) => {
  if (!chatId || chatId.length > 128) {
    throw new Error("Invalid chatId.");
  }

  if (!messages.length || messages[messages.length - 1]?.role !== "user") {
    throw new Error("The active chat must end with a user message.");
  }

  for (const message of messages) {
    if (message.role !== "user" && message.role !== "assistant") {
      throw new Error("Invalid message role.");
    }

    if (!message.content.trim()) {
      throw new Error("Message content is required.");
    }

    if (message.content.length > MAX_MESSAGE_CHARS) {
      throw new Error("Message content exceeds the server limit.");
    }
  }
};

async function requestOpenRouterStream(input: {
  apiKey: string;
  chatId: string;
  context: string;
  messages: ReturnType<ChatSessionStore["boundedActiveMessages"]>;
  onContent: (chunk: string) => void;
  signal?: AbortSignal;
}) {
  validateServerRequest(input.chatId, input.messages);

  const openrouter = createOpenRouter({
    apiKey: input.apiKey,
    appName: SITE_TITLE,
    appUrl: SITE_URL,
    compatibility: "strict",
  });

  const result = streamText({
    model: openrouter.chat(MODEL),
    system: input.context,
    messages: input.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    abortSignal: input.signal,
    maxRetries: 0,
    providerOptions: {
      openrouter: {
        reasoning: {
          effort: "xhigh",
          exclude: true,
        },
        tools: [
          {
            type: "openrouter:web_search",
            parameters: {
              engine: "auto",
              max_results: 5,
              max_total_results: 10,
              search_context_size: "medium",
            },
          },
          {
            type: "openrouter:web_fetch",
            parameters: {
              engine: "openrouter",
              max_uses: 6,
              max_content_tokens: 30_000,
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
}

async function askActiveChat(
  store: ChatSessionStore,
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

  const context = await loadChatContext();
  const store = new ChatSessionStore(new MemoryStorage());

  console.log(`Loaded chat context: ${context.length.toLocaleString()} characters`);
  console.log(`Created initial chat: ${store.activeChat.id}`);

  await askActiveChat(
    store,
    context,
    apiKey,
    "What kind of work does polarzero do? Keep it concise.",
  );

  await askActiveChat(
    store,
    context,
    apiKey,
    "Follow up: which recent projects best demonstrate that?",
  );

  const firstChatId = store.activeChat.id;
  const secondChatId = store.createChat();
  console.log(`\nCreated second chat: ${secondChatId}`);

  await askActiveChat(
    store,
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
