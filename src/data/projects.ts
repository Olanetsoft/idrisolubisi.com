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
  /** One line of proof, ideally a number. Optional when there is nothing worth saying. */
  proof?: string;
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
};

export const harnessIntro =
  "An agent that acts, the tools and verification it needs to act correctly, and a view over agents while they run.";

export const projects: Project[] = [
  {
    key: "swoopagent",
    layer: "Act",
    name: "SwoopAgent",
    group: "harness",
    oneLine:
      "Multi-tenant platform where each user runs a Claude-powered agent that trades real money on web and Telegram, with the backend checking and executing every trade.",
    proof: "Around 100 users trading real funds",
    stack: ["TypeScript", "Next.js", "Postgres", "Redis", "Docker", "Claude API"],
    badge: "Live",
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/swoopagent-claw" }],
    githubRepo: "Olanetsoft/swoopagent-claw",
  },
  {
    key: "midnight-mcp",
    layer: "Verify",
    name: "Midnight MCP server",
    group: "harness",
    oneLine:
      "MCP server, built in a weekend, that let AI agents search Midnight code and compile it before answering.",
    proof: "10,000+ downloads, 11,900+ agent tool calls",
    stack: ["TypeScript", "MCP", "Hono", "Cloudflare Workers", "Vectorize", "OpenAI API"],
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
    name: "Agent Lookout",
    group: "harness",
    oneLine:
      "Local dashboard for the Claude Code and Codex sessions on a machine: shows which need you and what they are asking, and jumps to the right window.",
    proof: "1,100+ npm downloads in its first week",
    stack: ["TypeScript", "React", "Vite", "Node.js", "Electron", "MCP"],
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
    proof: "9,000+ npm downloads",
    stack: ["TypeScript", "Node.js", "Compact", "Docker", "Midnight.js"],
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
      "Compile API for Compact that adds Run buttons to code samples and was the hosted compiler behind the Midnight MCP server.",
    proof: "Original author and maintainer",
    stack: ["TypeScript", "Node.js", "Hono", "Compact", "Docker", "Vitest"],
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
    stack: ["Solidity", "Foundry", "Axelar GMP", "Axelar ITS", "OpenZeppelin"],
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
    stack: ["TypeScript", "Next.js", "Supabase", "Redis", "OpenAI API"],
    badge: "Live",
    links: [{ label: "Site", url: "https://giftdice.com" }],
  },
  {
    key: "article-idea-generator",
    name: "Article Idea Generator",
    group: "more",
    oneLine: "AI writing tool that turns a topic into article titles, plus free tools for writers.",
    proof: "60 forks and 10 contributors",
    stack: ["TypeScript", "Next.js", "Supabase", "OpenAI API", "Tailwind CSS"],
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
      "macOS app that fixes quiet video audio with loudness normalisation, without clipping.",
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
      "Midnight’s example lending app that scores loans on credit data the lender never sees.",
    proof: "Top contributor, 51 of 107 commits, including a security fix",
    stack: ["TypeScript", "Compact", "React", "Vite", "Docker"],
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
      "Interactive book and exercises that teach Compact, Midnight’s zero-knowledge contract language, with code you compile on the page.",
    proof: "22 chapters and 17 exercises",
    stack: ["Compact", "mdBook", "JavaScript", "Netlify"],
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
    oneLine: "Twitter bot and REST API that explain Web3 terms in plain English.",
    proof: "97 merged pull requests from 31 contributors",
    stack: ["JavaScript", "Node.js", "Express", "Twitter API", "Jest"],
    badge: "Open source",
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/web3terms" }],
    githubRepo: "Olanetsoft/web3terms",
  },
];
