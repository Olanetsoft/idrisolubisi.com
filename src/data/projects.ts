export type Project = {
  name: string;
  description: string;
  href?: string;
  stars?: number;
  kind: "open-source" | "product";
  stack?: string;
};

// Star counts fetched from GitHub on 10 Sep 2026.
export const projects: Project[] = [
  {
    name: "midnight-mcp",
    description:
      "Open-source MCP server that gives AI assistants access to the Midnight blockchain — search contracts, compile Compact, explore docs. 10,000+ downloads.",
    href: "https://github.com/Olanetsoft/midnight-mcp",
    stars: 37,
    kind: "open-source",
    stack: "TypeScript · MCP",
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
    stack: "Next.js · OpenAI",
  },
  {
    name: "jwt-project",
    description: "Companion repository for one of the most-read Node.js authentication tutorials.",
    href: "https://github.com/Olanetsoft/jwt-project",
    stars: 154,
    kind: "open-source",
    stack: "Node.js",
  },
  {
    name: "web3terms",
    description: "A bot that explains Web3 and crypto terminology in plain language.",
    href: "https://github.com/Olanetsoft/web3terms",
    stars: 116,
    kind: "open-source",
  },
  {
    name: "foundry-axelar-gmp-example",
    description:
      "Cross-chain general-message-passing reference implementation; cut dApp setup time 55% and was adopted by 500+ developers.",
    href: "https://github.com/axelarnetwork/foundry-axelar-gmp-example",
    kind: "open-source",
    stack: "Foundry · Solidity",
  },
  {
    name: "GiftDice",
    description:
      "Consumer gift-exchange platform with 3,000+ users across 20+ countries — Stripe payments, AI features, real-time multiplayer quizzes, PWA and push notifications. Built and maintained solo.",
    href: "https://giftdice.com/",
    kind: "product",
    stack: "Next.js · Stripe · PostgreSQL",
  },
  {
    name: "SwoopAgent",
    description:
      "Self-hosted, multi-tenant autonomous AI-agent platform on Base with embedded wallets, on-chain swaps and Stripe billing. Engineered for money-movement correctness: atomic execution, idempotency keys, rate limiting and an independent circuit breaker. Live with real users.",
    kind: "product",
    stack: "Next.js · Drizzle · Redis · Privy · 0x",
  },
  {
    name: "AudioBoost",
    description:
      "Native macOS audio-repair app with two-pass EBU R128 loudness normalisation and lossless video passthrough.",
    href: "https://github.com/Olanetsoft/audioboost",
    kind: "product",
    stack: "Python · FFmpeg",
  },
];

export const githubStats = { repos: "310+", followers: "1,300+", stars: "2,000+" };
