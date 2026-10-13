/**
 * Projects, in the owner's card format: name, one line on what it is, one line
 * of proof, stack, links. The agent-harness trio leads as one body of work.
 * Star counts are not stored here; they are fetched at build time
 * (scripts/fetch-data.mjs) for every card with a public `githubRepo`.
 * No em-dashes. The Midnight MCP server is always described in the past tense.
 */
export type ProjectLink = { label: string; url: string };

export type Project = {
  key: string;
  name: string;
  group: "harness" | "more";
  oneLine: string;
  proof: string;
  stack: string[];
  badge?: "Live" | "Open source" | "npm" | "Reference";
  links: ProjectLink[];
  /** "owner/repo" for the live star count. */
  githubRepo?: string;
  /** Hide the live star count on this card. */
  hideStars?: boolean;
  /** One-line install or run command, shown with a copy button. */
  command?: string;
  /** Featured cards: which part of the agent harness this is. */
  layer?: "Act" | "Verify" | "Observe";
  /** Featured cards: one engineering detail, the senior signal. */
  how?: string;
};

export const harnessIntro =
  "An agent that acts, the tools and verification it needs to act correctly, and a view over agents while they run.";

export const projects: Project[] = [
  {
    key: "swoopagent",
    layer: "Act",
    how: "Agents propose; the backend validates, signs and executes. Closed a double-sell race with an optimistic-lock mutex, Redis idempotency keys and single-transaction writes.",
    name: "SwoopAgent",
    group: "harness",
    oneLine:
      "Multi-tenant platform where each user runs a Claude-powered agent that trades real money, on web and Telegram.",
    proof: "Around 100 users trading real funds, every open position checked every 30 seconds",
    stack: ["Next.js", "TypeScript", "Postgres", "Redis", "Docker"],
    badge: "Live",
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/swoopagent-claw" }],
    githubRepo: "Olanetsoft/swoopagent-claw",
  },
  {
    key: "midnight-mcp",
    layer: "Verify",
    how: "A hosted compiler worked as a verification gate, so assistants returned code that compiles instead of confident wrong code.",
    name: "Midnight MCP server",
    group: "harness",
    oneLine:
      "MCP server, built in a weekend, that let AI agents search Midnight code and compile it before answering.",
    proof: "10,000+ downloads, 11,900+ agent tool calls",
    stack: ["TypeScript", "MCP", "Cloudflare Workers"],
    badge: "Open source",
    links: [
      { label: "GitHub", url: "https://github.com/Olanetsoft/midnight-mcp" },
      { label: "npm", url: "https://www.npmjs.com/package/midnight-mcp" },
    ],
    githubRepo: "Olanetsoft/midnight-mcp",
  },
  {
    key: "agent-lookout",
    layer: "Observe",
    how: "Flags Claude Code sessions waiting for approval with what they are asking, and jumps to the right VS Code window or tmux pane.",
    name: "Agent Lookout",
    group: "harness",
    oneLine:
      "Local dashboard for the Claude Code and Codex sessions on a machine, and which of them need you.",
    proof: "Shipped October 2026, 1,100+ npm downloads in its first week",
    stack: ["TypeScript", "React", "Vite", "MCP"],
    badge: "npm",
    links: [
      { label: "GitHub", url: "https://github.com/Olanetsoft/agent-lookout" },
      { label: "Site", url: "https://agent-lookout.vercel.app" },
      { label: "npm", url: "https://www.npmjs.com/package/agent-lookout" },
    ],
    githubRepo: "Olanetsoft/agent-lookout",
    command: "npx agent-lookout",
  },
  {
    key: "create-mn-app",
    name: "create-mn-app",
    group: "more",
    oneLine:
      "Scaffolding CLI that sets up a Midnight app with a Compact contract, a local devnet and deploy scripts.",
    proof: "9,000+ npm downloads, now maintained in the Midnight GitHub org",
    stack: ["TypeScript", "Node.js", "Docker", "Compact"],
    badge: "npm",
    links: [
      { label: "GitHub", url: "https://github.com/midnightntwrk/create-mn-app" },
      { label: "npm", url: "https://www.npmjs.com/package/create-mn-app" },
    ],
    githubRepo: "midnightntwrk/create-mn-app",
    command: "npx create-mn-app@latest my-app",
  },
  {
    key: "compact-playground",
    name: "Compact Playground",
    group: "more",
    oneLine:
      "Compile API for Compact that adds Run buttons to code samples, so learners compile from the page.",
    proof: "Powers the Run buttons in Learn Compact, with multi-version compiles in one request",
    stack: ["TypeScript", "Hono", "Docker"],
    badge: "Open source",
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/compact-playground" }],
    githubRepo: "Olanetsoft/compact-playground",
  },
  {
    key: "foundry-axelar-gmp-example",
    name: "Foundry Axelar GMP example",
    group: "more",
    oneLine:
      "Reference implementation for cross-chain calls and token transfers with Axelar GMP and Foundry.",
    proof: "500+ weekly adoptions, 55% cut in integration setup time",
    stack: ["Solidity", "Foundry", "Axelar GMP"],
    badge: "Reference",
    links: [
      { label: "GitHub", url: "https://github.com/axelarnetwork/foundry-axelar-gmp-example" },
    ],
    githubRepo: "axelarnetwork/foundry-axelar-gmp-example",
    hideStars: true,
  },
  {
    key: "giftdice",
    name: "GiftDice",
    group: "more",
    oneLine:
      "Gift exchange and wishlist platform with AI gift ideas, real-time party games and an installable PWA.",
    proof: "3,000+ users across 20+ countries",
    stack: ["Next.js", "TypeScript", "Supabase", "OpenAI API"],
    badge: "Live",
    links: [{ label: "Site", url: "https://giftdice.com" }],
  },
  {
    key: "article-idea-generator",
    name: "Article Idea Generator",
    group: "more",
    oneLine:
      "Open-source AI writing tool that turns a topic into article titles, plus free tools for writers.",
    proof: "60 forks and 10 contributors on GitHub",
    stack: ["Next.js", "TypeScript", "OpenAI API", "Supabase"],
    badge: "Open source",
    links: [
      { label: "GitHub", url: "https://github.com/Olanetsoft/article-idea-generator" },
      { label: "Site", url: "https://www.articleideagenerator.com" },
    ],
    githubRepo: "Olanetsoft/article-idea-generator",
  },
  {
    key: "audioboost",
    name: "AudioBoost",
    group: "more",
    oneLine:
      "macOS app that fixes quiet video audio with two-pass EBU R128 loudness normalisation, without clipping.",
    proof: "Three loudness presets: -14, -16 and -23 LUFS",
    stack: ["FFmpeg", "macOS"],
    badge: "Open source",
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/audioboost" }],
    githubRepo: "Olanetsoft/audioboost",
  },
  {
    key: "zk-loan",
    name: "ZK Loan",
    group: "more",
    oneLine:
      "Midnight's reference lending app (contract, CLI, React UI and signing API) that scores loans on credit data the lender never sees.",
    proof: "Top contributor, 51 of 107 commits, including a fix for a signature-forgery bug",
    stack: ["TypeScript", "Compact", "React", "Docker"],
    badge: "Reference",
    links: [{ label: "GitHub", url: "https://github.com/midnightntwrk/example-zkloan" }],
    githubRepo: "midnightntwrk/example-zkloan",
    hideStars: true,
  },
  {
    key: "learn-compact",
    name: "Learn Compact",
    group: "more",
    oneLine:
      "Interactive book and hands-on exercises for Compact, Midnight's zero-knowledge contract language, with code you compile on the page.",
    proof: "22 chapters and 17 exercises, compiled in the page through Compact Playground",
    stack: ["Compact", "mdBook", "JavaScript"],
    badge: "Live",
    links: [
      { label: "Site", url: "https://learn-compact.netlify.app" },
      { label: "GitHub", url: "https://github.com/Olanetsoft/learn-compact" },
    ],
    githubRepo: "Olanetsoft/learn-compact",
    hideStars: true,
  },
  {
    key: "web3terms",
    name: "web3terms",
    group: "more",
    oneLine:
      "Twitter bot and REST API that explain web3 terms in plain English, built in the open with the community.",
    proof: "97 merged pull requests from 31 contributors, 215 terms",
    stack: ["Node.js", "Express", "Jest"],
    badge: "Open source",
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/web3terms" }],
    githubRepo: "Olanetsoft/web3terms",
  },
];
