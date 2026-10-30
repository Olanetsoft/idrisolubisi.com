import { checkSite, InputError } from "../../src/lib/ai-readiness";

/**
 * GET /api/ai-check?url=example.com: the JSON behind /tools/ai-readiness.
 * Netlify limits each visitor to ten checks a minute, and the CDN keeps each
 * answer for ten minutes, so the same site is not fetched again and again.
 */
export default async (request: Request) => {
  const url = new URL(request.url).searchParams.get("url") ?? "";
  try {
    const report = await checkSite(url);
    return Response.json(report, {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
        "netlify-cdn-cache-control": "public, durable, s-maxage=600",
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
