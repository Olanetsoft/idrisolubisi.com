import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/how-to-create-react-app`, lastModified: new Date("2020-02-15"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
