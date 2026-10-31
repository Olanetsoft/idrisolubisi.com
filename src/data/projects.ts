/**
 * Projects, in the owner's card format: name, one line on what it is, one line
 * of proof, stack, links. The agent-harness trio leads as one body of work.
 * Star counts are not stored here; they are fetched at build time by
 * scripts/fetch-data.mjs for each repo in its REPOS list, so add a new
 * card's `githubRepo` there too (that is also how private links are hidden).
 * No em-dashes. The Midnight MCP server is always described in the past tense.
 */
export type ProjectLink = { label: string; url: string };

export type Project = {
  key: string;
  name: string;
  group: "harness" | "more";
  oneLine: string;
  /** One line of proof, ideally a number. Not shown on the card (kept clean); /llms.txt and /llms-full.txt carry it. */
  proof?: string;
  stack: string[];
  links: ProjectLink[];
  /** "owner/repo": star count (in /llms-full.txt) and private-link hiding. */
  githubRepo?: string;
  /** Leave this repo's star count out of /llms-full.txt. */
  hideStars?: boolean;
  /** One-line install or run command, shown with a copy button. */
  command?: string;
  /** Featured cards: which part of the agent harness this is. */
  layer?: "Act" | "Verify" | "Observe";
  /** How it works, in a line or two. Not shown on the page; used in /llms-full.txt. */
  detail?: string;
  /** The few words on the card, under the name. */
  tagline: string;
  /**
   * The card image in public/images/work/: a screenshot of the site, the GitHub
   * or npm page, the README, the project's X account, the repo's own image, its
   * code or (private repos) a diagram.
   */
  image: string;
  /** Alt text for the image when the card is not a link (a private repo). */
  imageAlt?: string;
};

export const harnessIntro =
  "An agent that acts, the tools and verification that keep it correct, and a view over agents while they run.";

export const projects: Project[] = [
  {
    key: "swoopagent",
    layer: "Act",
    name: "SwoopAgent",
    group: "harness",
    oneLine:
      "Trading platform where a Claude agent picked new tokens on Base and traded real money from a web dashboard, while backend code checked every buy and signed and executed every trade.",
    stack: ["TypeScript", "Next.js", "Postgres", "Redis", "Docker", "Claude API", "OpenClaw"],
    links: [
      { label: "Case study", url: "/work/swoopagent" },
      { label: "GitHub", url: "https://github.com/Olanetsoft/swoopagent-claw" },
    ],
    githubRepo: "Olanetsoft/swoopagent-claw",
    detail:
      "Built solo in February 2026: 136 commits in 19 days, 165 unit tests. The agent ran on OpenClaw and could only propose; the backend re-checked every buy at execution time, signed it and swapped through 0x on Base. A backend loop repriced every open position every 30 seconds and enforced stop-losses and staged take-profits even with the agent down, and a -15% daily circuit breaker blocked new buys. Sells retried with rising slippage, counted only once the on-chain receipt confirmed, and closed a position only if it was still open, in one transaction with the trade. After tokens whose only pool was on Uniswap V4 could be bought but not sold, V4-only pools were blocked in the backend. Not running today.",
    tagline: "A Claude trading agent behind a safety layer",
    image: "/images/work/swoopagent-loop.jpg",
    imageAlt:
      "Diagram: a Claude agent proposes trades; the backend checks, signs and executes them; a safety loop reprices open positions every 30 seconds for stop-losses and take-profits",
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
    links: [
      { label: "GitHub", url: "https://github.com/Olanetsoft/midnight-mcp" },
      { label: "npm", url: "https://www.npmjs.com/package/midnight-mcp" },
    ],
    githubRepo: "Olanetsoft/midnight-mcp",
    detail:
      "A hosted compiler worked as a verification gate, so assistants returned code that compiles instead of confident wrong code. In 2026 Midnight standardised on two official tools, Kapa MCP and Midnight Expert, and the server was wound down.",
    tagline: "Gave AI agents Midnight code search and a compile check",
    image: "/images/work/midnight-mcp-repo.jpg",
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
    links: [
      { label: "GitHub", url: "https://github.com/Olanetsoft/agent-lookout" },
      { label: "Site", url: "https://agent-lookout.vercel.app" },
      { label: "npm", url: "https://www.npmjs.com/package/agent-lookout" },
    ],
    githubRepo: "Olanetsoft/agent-lookout",
    command: "npx agent-lookout",
    detail:
      "Flags Claude Code sessions waiting for approval with what they are asking, and jumps to the right VS Code window or tmux pane. Shipped October 2026.",
    tagline: "One screen for every agent session that needs you",
    image: "/images/work/agent-lookout.jpg",
  },
  {
    key: "ai-readiness",
    name: "AI readiness check",
    group: "more",
    oneLine:
      "Free tool that shows how a website looks to AI agents: its llms.txt, what its HTML says before any script runs, its structured data, which AI crawlers it lets in and its sitemap.",
    stack: ["TypeScript", "Next.js", "Netlify Functions"],
    links: [{ label: "Tool", url: "/tools/ai-readiness" }],
    detail:
      "Reads only the named site's public files through a guarded fetcher: public addresses only, checked after DNS and on every redirect, with time and size limits, and a per-visitor rate limit. Nothing is stored.",
    tagline: "See any site the way an AI agent does",
    image: "/images/work/ai-readiness.jpg",
  },
  {
    key: "create-mn-app",
    name: "create-mn-app",
    group: "more",
    oneLine:
      "Scaffolding CLI that sets up a Midnight app with a Compact contract, a local devnet and deploy scripts.",
    proof: "9,000+ npm downloads",
    stack: ["TypeScript", "Node.js", "Compact", "Docker", "Midnight.js"],
    links: [
      { label: "GitHub", url: "https://github.com/midnightntwrk/create-mn-app" },
      { label: "npm", url: "https://www.npmjs.com/package/create-mn-app" },
    ],
    githubRepo: "midnightntwrk/create-mn-app",
    command: "npx create-mn-app@latest my-app",
    detail: "Now maintained in the Midnight GitHub organisation.",
    tagline: "A Midnight app, devnet and deploy scripts in one command",
    image: "/images/work/create-mn-app.jpg",
  },
  {
    key: "compact-playground",
    name: "Compact Playground",
    group: "more",
    oneLine:
      "Compile API for Compact that adds Run buttons to code samples and was the hosted compiler behind the Midnight MCP server.",
    proof: "Original author and maintainer",
    stack: ["TypeScript", "Node.js", "Hono", "Compact", "Docker", "Vitest"],
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/compact-playground" }],
    githubRepo: "Olanetsoft/compact-playground",
    tagline: "The compile API behind Run buttons, which also powered the MCP server",
    image: "/images/work/compact-playground.jpg",
  },
  {
    key: "foundry-axelar-gmp-example",
    name: "Foundry Axelar GMP example",
    group: "more",
    oneLine: "Working Foundry examples of cross-chain calls and token transfers with Axelar GMP.",
    proof: "55% cut in integration setup time, 500+ weekly developer activations",
    stack: ["Solidity", "Foundry", "Axelar GMP", "Axelar ITS", "OpenZeppelin"],
    links: [
      { label: "GitHub", url: "https://github.com/axelarnetwork/foundry-axelar-gmp-example" },
    ],
    githubRepo: "axelarnetwork/foundry-axelar-gmp-example",
    hideStars: true,
    tagline: "Foundry examples of cross-chain calls with Axelar",
    image: "/images/work/foundry-axelar-gmp-example.jpg",
  },
  {
    key: "giftdice",
    name: "GiftDice",
    group: "more",
    oneLine:
      "Gift exchange and wishlist platform with AI gift ideas, real-time party games and an installable PWA.",
    proof: "3,000+ users across 20+ countries",
    stack: ["TypeScript", "Next.js", "Supabase", "Redis", "OpenAI API"],
    links: [{ label: "Site", url: "https://giftdice.com" }],
    tagline: "Gift exchanges and wishlists with AI gift ideas",
    image: "/images/work/giftdice.jpg",
  },
  {
    key: "article-idea-generator",
    name: "Article Idea Generator",
    group: "more",
    oneLine: "AI writing tool that turns a topic into article titles, plus free tools for writers.",
    proof: "60 forks and 10 contributors",
    stack: ["TypeScript", "Next.js", "Supabase", "OpenAI API", "Tailwind CSS"],
    links: [
      { label: "Site", url: "https://www.articleideagenerator.com" },
      { label: "GitHub", url: "https://github.com/Olanetsoft/article-idea-generator" },
    ],
    githubRepo: "Olanetsoft/article-idea-generator",
    tagline: "Turns a topic into article titles",
    image: "/images/work/article-idea-generator.jpg",
  },
  {
    key: "audioboost",
    name: "AudioBoost",
    group: "more",
    oneLine:
      "macOS app that fixes quiet video audio with loudness normalisation, without clipping.",
    stack: ["FFmpeg", "macOS"],
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/audioboost" }],
    githubRepo: "Olanetsoft/audioboost",
    detail: "Two-pass EBU R128 loudness normalisation with lossless video passthrough.",
    tagline: "Fixes quiet video audio on macOS",
    image: "/images/work/audioboost.jpg",
  },
  {
    key: "zk-loan",
    name: "ZK Loan",
    group: "more",
    oneLine:
      "Midnight’s example lending app that scores loans on credit data the lender never sees.",
    proof: "Top contributor, 51 of 107 commits, including a security fix",
    stack: ["TypeScript", "Compact", "React", "Vite", "Docker"],
    links: [{ label: "GitHub", url: "https://github.com/midnightntwrk/example-zkloan" }],
    githubRepo: "midnightntwrk/example-zkloan",
    hideStars: true,
    tagline: "Loans scored on data the lender never sees",
    image: "/images/work/zk-loan.jpg",
  },
  {
    key: "learn-compact",
    name: "Learn Compact",
    group: "more",
    oneLine:
      "Interactive book and exercises that teach Compact, Midnight’s zero-knowledge contract language, with code you compile on the page.",
    proof: "9 chapters and 17 exercises",
    stack: ["Compact", "mdBook", "JavaScript", "Netlify"],
    links: [
      { label: "Site", url: "https://learn-compact.netlify.app" },
      { label: "GitHub", url: "https://github.com/Olanetsoft/learn-compact" },
    ],
    githubRepo: "Olanetsoft/learn-compact",
    hideStars: true,
    tagline: "An interactive book that teaches Compact",
    image: "/images/work/learn-compact.jpg",
  },
  {
    key: "web3terms",
    name: "web3terms",
    group: "more",
    oneLine: "Twitter bot and REST API that explain Web3 terms in plain English.",
    proof: "97 merged pull requests from 31 contributors",
    stack: ["JavaScript", "Node.js", "Express", "Twitter API", "Jest"],
    links: [{ label: "GitHub", url: "https://github.com/Olanetsoft/web3terms" }],
    githubRepo: "Olanetsoft/web3terms",
    tagline: "A bot and API that explain Web3 terms",
    image: "/images/work/web3terms.jpg",
  },
];

/** Open-source work not shown as a card; listed in /llms-full.txt. */
export const otherOpenSource = [
  {
    name: "awesome-hackathon-projects",
    url: "https://github.com/Olanetsoft/awesome-hackathon-projects",
    what: "curated hackathon project ideas",
  },
];
