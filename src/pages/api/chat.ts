import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import type { APIContext } from "astro";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const prerender = false;

type ChatRole = "user" | "assistant";

type ClientMessage = {
  id?: unknown;
  role?: unknown;
  content?: unknown;
  createdAt?: unknown;
};

const DEFAULT_MODEL = "deepseek/deepseek-v4-flash";
const DEFAULT_REASONING_EFFORT = "medium";
const DEFAULT_MAX_OUTPUT_TOKENS = 1_000;
const MAX_BODY_BYTES = 128 * 1024;
const SERVER_MAX_MESSAGES = 24;
const SERVER_MESSAGE_WINDOW = 12;
const MAX_MESSAGE_CHARS = 4_000;
const SITE_URL = "https://polarzero.xyz";
const SITE_TITLE = "polarzero";
const INVALID_BODY = { error: "Invalid chat request." };
const UNAVAILABLE_BODY = { error: "The assistant is temporarily unavailable." };

let cachedChatInstructions: string | undefined;
let cachedChatContext: string | undefined;

const encoder = new TextEncoder();

const envValue = (key: string) => {
  const astroEnv = import.meta.env as Record<string, string | undefined>;
  return process.env[key] ?? astroEnv[key];
};

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const loadChatInstructions = async () => {
  cachedChatInstructions ??= await readFile(
    resolve(process.cwd(), "src/data/chat-instructions.md"),
    "utf8",
  );
  return cachedChatInstructions;
};

const loadChatContext = async () => {
  cachedChatContext ??= await readFile(resolve(process.cwd(), "src/data/chat-context.md"), "utf8");
  return cachedChatContext;
};

const configuredModel = () => envValue("OPENROUTER_MODEL") ?? DEFAULT_MODEL;

const configuredReasoningEffort = () =>
  envValue("OPENROUTER_REASONING_EFFORT") ?? DEFAULT_REASONING_EFFORT;

const configuredMaxOutputTokens = () => {
  const value = Number(envValue("OPENROUTER_MAX_OUTPUT_TOKENS"));
  return Number.isInteger(value) && value > 0 ? value : DEFAULT_MAX_OUTPUT_TOKENS;
};

const parseRequest = (value: unknown) => {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid body.");
  }

  const candidate = value as { chatId?: unknown; messages?: unknown };

  if (
    typeof candidate.chatId !== "string" ||
    candidate.chatId.length === 0 ||
    candidate.chatId.length > 128
  ) {
    throw new Error("Invalid chat id.");
  }

  if (
    !Array.isArray(candidate.messages) ||
    candidate.messages.length === 0 ||
    candidate.messages.length > SERVER_MAX_MESSAGES
  ) {
    throw new Error("Invalid messages.");
  }

  if (candidate.messages.at(-1)?.role !== "user") {
    throw new Error("Last message must be user.");
  }

  const messages = candidate.messages.map((message: ClientMessage) => {
    if (!message || typeof message !== "object") {
      throw new Error("Invalid message.");
    }

    if (message.role !== "user" && message.role !== "assistant") {
      throw new Error("Invalid role.");
    }

    if (typeof message.content !== "string" || !message.content.trim()) {
      throw new Error("Invalid content.");
    }

    if (message.content.length > MAX_MESSAGE_CHARS) {
      throw new Error("Message too large.");
    }

    return {
      role: message.role as ChatRole,
      content: message.content,
    };
  });

  if (!messages.some((message) => message.role === "user")) {
    throw new Error("Missing user message.");
  }

  return {
    chatId: candidate.chatId,
    messages: messages.slice(-SERVER_MESSAGE_WINDOW),
  };
};

const sse = (event: "message" | "done" | "error", data: unknown) =>
  encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

export async function POST({ request }: APIContext) {
  const rawBody = await request.text();

  if (encoder.encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return jsonResponse(INVALID_BODY, 400);
  }

  let parsedRequest: ReturnType<typeof parseRequest>;

  try {
    parsedRequest = parseRequest(JSON.parse(rawBody));
  } catch {
    return jsonResponse(INVALID_BODY, 400);
  }

  const apiKey = envValue("OPENROUTER_API_KEY");

  if (!apiKey) {
    return jsonResponse(UNAVAILABLE_BODY, 500);
  }

  const instructions = await loadChatInstructions();
  const context = await loadChatContext();

  const stream = new ReadableStream({
    async start(controller) {
      let hasStarted = false;

      try {
        const openrouter = createOpenRouter({
          apiKey,
          appName: SITE_TITLE,
          appUrl: SITE_URL,
          compatibility: "strict",
        });

        const result = streamText({
          model: openrouter.chat(configuredModel()),
          system: `${instructions}\n\n# Knowledge document\n\n${context}`,
          messages: parsedRequest.messages,
          abortSignal: request.signal,
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
          hasStarted = true;
          controller.enqueue(sse("message", { content: chunk }));
        }

        controller.enqueue(sse("done", {}));
      } catch {
        controller.enqueue(sse("error", UNAVAILABLE_BODY));

        if (!hasStarted) {
          controller.enqueue(sse("done", {}));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
