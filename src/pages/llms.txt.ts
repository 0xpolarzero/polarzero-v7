import chatContext from "@/data/chat-context.md?raw";

export function GET() {
  return new Response(chatContext, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
