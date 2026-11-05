"use client";

import { jsonLd } from "@/lib/json-ld";

/**
 * The JSON-LD, in the HTML of every page and nowhere else. Crawlers read it
 * there and the browser has no use for it, so a client component keeps it out
 * of the page's inline data, and out of the bundle: this module is the server's
 * alone. Hydration leaves the script as the server wrote it.
 */
export function StructuredData() {
  const json = typeof window === "undefined" ? JSON.stringify(jsonLd) : "";
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
