import { renderLlmsFullTxt } from "@/lib/llms-full";

export const dynamic = "force-static";

export function GET() {
  return new Response(renderLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
