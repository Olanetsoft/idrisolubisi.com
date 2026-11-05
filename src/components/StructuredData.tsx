"use client";

import type { jsonLd as JsonLd } from "@/lib/json-ld";

/**
 * The JSON-LD, in the HTML of every page and nowhere else. Crawlers read it
 * there and the browser has no use for it, so a client component keeps it out
 * of the page's inline data. The data is required only on the server: the
 * client build replaces typeof window, drops that branch, and with it the
 * module, so none of the data reaches the bundle. Hydration leaves the script
 * as the server wrote it.
 */
export function StructuredData() {
  const json =
    typeof window === "undefined"
      ? // eslint-disable-next-line @typescript-eslint/no-require-imports
        JSON.stringify((require("@/lib/json-ld") as { jsonLd: typeof JsonLd }).jsonLd)
      : "";
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
