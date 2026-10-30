import { checkSite, InputError } from "../../src/lib/ai-readiness";

/**
 * GET /api/ai-check?url=example.com: the JSON behind /tools/ai-readiness.
 * Netlify limits each visitor to ten checks a minute, and the CDN keeps each
 * answer for ten minutes, keyed on the url parameter alone, so the same page
 * is not fetched again and again. Browsers say where a request came from, and
 * one sent by another website is refused, so no page can make its visitors
 * run checks.
 */
export default async (request: Request) => {
  const from = request.headers.get("sec-fetch-site");
  if (from && from !== "same-origin" && from !== "none") {
    return Response.json(
      { error: "Run the check from idrisolubisi.com/tools/ai-readiness." },
      { status: 403, headers: { "cache-control": "no-store" } },
    );
  }
  const url = new URL(request.url).searchParams.get("url") ?? "";
  try {
    const report = await checkSite(url);
    return Response.json(report, {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
        "netlify-cdn-cache-control": "public, durable, s-maxage=600",
        "netlify-vary": "query=url",
      },
    });
  } catch (error) {
    const known = error instanceof InputError;
    return Response.json(
      { error: known ? error.message : "The check failed. Try again in a minute." },
      { status: known ? 400 : 502, headers: { "cache-control": "no-store" } },
    );
  }
};

export const config = {
  path: "/api/ai-check",
  method: "GET",
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
