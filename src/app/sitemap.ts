import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((c) => ({
      url: `${site.url}/work/${c.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
