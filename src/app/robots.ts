import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// AI and search crawlers are explicitly welcome. Structured information for
// language models is published at /llms.txt and /llms-full.txt.
const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Amazonbot",
  "cohere-ai",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/__forms.html"] },
      { userAgent: aiCrawlers, allow: "/", disallow: ["/__forms.html"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
