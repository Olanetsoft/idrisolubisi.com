import { renderLlmsFullTxt } from "@/lib/llms-full";

export const dynamic = "force-static";
// Rebuilt daily, like the page, so an upcoming talk loses its mark once the day has passed.
export const revalidate = 86400;

export function GET() {
  return new Response(renderLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
