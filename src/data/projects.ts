export type Project = {
  name: string;
  description: string;
  href?: string;
  stars?: number;
  kind: "open-source" | "product";
  /** What is true about the project today, when it differs from the description. */
  status?: string;
  note?: string;
};

/** Star counts fetched from GitHub on 11 Sep 2026. */
export const starsFetchedAt = "2026-09-11";

export const projects: Project[] = [
  {
    name: "midnight-mcp",
    description:
      "Open-source MCP server for the Midnight blockchain: search contracts, compile Compact, read the docs from inside Claude, Cursor or Copilot. 10,000+ downloads on npm.",
    href: "https://github.com/Olanetsoft/midnight-mcp",
    stars: 37,
    kind: "open-source",
    status:
      "Being wound down in favour of Midnight’s official Kapa MCP and Midnight Expert; the package still installs and every tool carries the migration notice.",
  },
  {
    name: "foundry-axelar-gmp-example",
    description:
      "Cross-chain general-message-passing reference implementation in Foundry and Solidity; cut dApp setup time 55% and was adopted by 500+ developers.",
    href: "https://github.com/axelarnetwork/foundry-axelar-gmp-example",
    stars: 13,
    kind: "open-source",
    note: "Written by me in the axelarnetwork org",
  },
  {
    name: "awesome-hackathon-projects",
    description: "A curated list of hackathon project ideas, organised by technology and complexity.",
    href: "https://github.com/Olanetsoft/awesome-hackathon-projects",
    stars: 1816,
    kind: "open-source",
  },
  {
    name: "article-idea-generator",
    description: "AI-powered article title generation plus a dozen small tools for technical writers.",
    href: "https://github.com/Olanetsoft/article-idea-generator",
    stars: 236,
    kind: "open-source",
  },
  {
    name: "jwt-project",
    description: "Companion repository for one of the most-read Node.js authentication tutorials.",
    href: "https://github.com/Olanetsoft/jwt-project",
    stars: 154,
    kind: "open-source",
  },
  {
    name: "GiftDice",
    description:
      "Consumer gift-exchange product with 3,000+ users across 20+ countries: Stripe payments, AI features, real-time multiplayer quizzes, PWA and push notifications. Built and maintained solo.",
    href: "https://giftdice.com/",
    kind: "product",
  },
  {
    name: "SwoopAgent",
    description:
      "Self-hosted, multi-tenant autonomous AI-agent platform on Base with embedded wallets, on-chain swaps and Stripe billing. Engineered for money-movement correctness: atomic execution, idempotency keys, rate limiting and an independent circuit breaker. Live with real users.",
    kind: "product",
  },
  {
    name: "AudioBoost",
    description:
      "Native macOS audio-repair app with two-pass EBU R128 loudness normalisation and lossless video passthrough.",
    href: "https://github.com/Olanetsoft/audioboost",
    kind: "product",
  },
];
