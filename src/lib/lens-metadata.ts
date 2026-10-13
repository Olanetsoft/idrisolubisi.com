import type { Metadata } from "next";
import { lenses, type LensKey } from "@/data/lenses";
import { site } from "@/data/site";

/**
 * Metadata for a tailored lens URL: its own title and description for link
 * previews, with the canonical pointing at the home page so search engines
 * index one page.
 */
export function lensMetadata(key: LensKey): Metadata {
  const lens = lenses[key];
  return {
    title: { absolute: lens.metaTitle },
    description: lens.metaDescription,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: `${site.url}${lens.path}`,
      siteName: site.name,
      title: lens.metaTitle,
      description: lens.metaDescription,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      site: `@${site.handle}`,
      creator: `@${site.handle}`,
      title: lens.metaTitle,
      description: lens.metaDescription,
    },
  };
}
