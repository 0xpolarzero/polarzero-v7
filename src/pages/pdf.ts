import { generateProfilePdf } from "@/lib/pdf";

export const prerender = true;

export async function GET() {
  const pdf = await generateProfilePdf();

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="polarzero.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
