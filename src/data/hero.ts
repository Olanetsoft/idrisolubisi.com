import { site } from "./site";

/**
 * The hero: one intro that covers every role, four numbers, and a rolling
 * log of short facts. Every figure comes from the owner's verified brief or
 * public data (npm, GitHub). No employer names in the intro, no em-dashes.
 * In the intro, ==text== marks the one highlighted clause and [label](url)
 * renders as a link.
 */
export type Metric = {
  /** What the number is about, shown small above it. */
  source: string;
  value: string;
  caption: string;
  /** Section or project anchor the tile links to. */
  href?: string;
};

/** One line of the activity log: a tag and a true fact the tiles do not already show. */
export type LogLine = { tag: string; fact: string };

export const hero: { headline: string; intro: string; metrics: Metric[]; log: LogLine[] } = {
  headline: site.role,
  intro: site.bio[0],
  metrics: [
    {
      source: "Developer support",
      value: "100,000+",
      caption: "developers supported hands-on, rated 4.8/5",
      href: "#experience",
    },
    {
      source: "Partner integrations",
      value: "55%",
      caption: "cut in integration setup time",
      href: "#foundry-axelar-gmp-example",
    },
    {
      source: "MCP server",
      value: "10,000+",
      caption: "downloads, built so AI coding assistants write correct code",
      href: "#midnight-mcp",
    },
    {
      source: "Payments backend",
      value: "50,000+",
      caption: "users on a payment service I built, 99.9% uptime",
      href: "#experience",
    },
  ],
  log: [
    { tag: "tutorials", fact: "10M+ reads across 40+ tutorials" },
    { tag: "swoopagent", fact: "every position checked every 30s" },
    { tag: "partner-teams", fact: "embedded from discovery to production launch" },
    { tag: "agent-lookout", fact: "flags agent sessions waiting for approval" },
    { tag: "talks", fact: "spoken at Devcon and ETHCC" },
  ],
};
