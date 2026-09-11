export type CaseStudyLink = { label: string; href: string };
export type CaseStudySection = { heading: string; paragraphs?: string[]; bullets?: string[] };

/** The measured result of a piece of work, with where and when it was checked. */
export type Output = {
  items: string[];
  /** Zero-based index of the one item highlighted with the marker on the home page. */
  mark?: number;
  source: string;
  href: string;
  asOf: string;
};

export type CaseStudy = {
  slug: string;
  org: string;
  role: string;
  period: string;
  title: string;
  /** One-paragraph hook, also used as the page description. */
  summary: string;
  /** First-person, dated account of the problem and what was built. */
  story: string;
  /** What is true about the work today, when that differs from the story. */
  status?: string;
  output: Output;
  /** The part most teams skip: one sentence of judgement, not metadata. */
  skipped: string;
  /** Which real artefact the home page shows beside the claim. */
  exhibit: "toolCategories" | "axelarCommands" | "pressHeadline";
  stack: string;
  sections: CaseStudySection[];
  links: CaseStudyLink[];
  showOnHome?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "midnight-agent-era-devrel",
    org: "Midnight",
    role: "Senior Developer Relations Engineer",
    period: "2025–26",
    title: "Making a zero-knowledge blockchain buildable by humans and AI agents",
    summary:
      "The first developer to read a new stack’s docs is now often an AI coding agent. I built the open-source Midnight MCP server, re-architected the documentation for LLM retrieval and launched a three-tier zero-knowledge curriculum.",
    story:
      "In 2025 developers arrived at Midnight with Claude, Cursor or Copilot already open, and the agent was the first thing to read the docs. The docs were client-rendered, so to an agent they were a wall of JavaScript, and partners were losing days to onboarding friction the team could not see. I built the MCP server so an agent could search the codebase, compile Compact and read the documentation from inside the editor, re-architected the docs for retrieval with server-side rendering and an llms.txt index, and launched Midnight Academy, a three-tier Compact and zero-knowledge curriculum.",
    status:
      "In 2026 Midnight standardised on two official tools, Kapa MCP and Midnight Expert, and midnight-mcp is being wound down; every tool on the server now carries the migration notice. The numbers below are from the period it was live.",
    output: {
      items: [
        "10,000+ downloads",
        "11,900+ agent tool calls",
        "30 tools in seven categories",
        "1,576 enrolled, 1,120+ certified",
      ],
      mark: 3,
      source: "github.com/Olanetsoft/midnight-mcp",
      href: "https://github.com/Olanetsoft/midnight-mcp",
      asOf: "2026-09-11",
    },
    skipped:
      "Bounties were paid only for tutorials whose code compiled. The programme tripled anyway: 20 published tutorials from 12 contributors.",
    exhibit: "toolCategories",
    stack: "TypeScript, MCP, Compact, zero-knowledge circuits, Docusaurus",
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "Midnight is a data-protection blockchain for confidential smart contracts. Building on it means learning a new language (Compact), zero-knowledge circuits and a proof server, a steep curve even for experienced engineers.",
          "By 2025 the curve had a new shape. Developers arrived with Claude, Cursor or Copilot open, and the agent was the first thing to read the docs. Documentation rendered client-side and written only for humans was, to an agent, a wall of JavaScript. Partners were losing days on onboarding friction the team could not see.",
        ],
      },
      {
        heading: "What I built",
        bullets: [
          "Shipped and open-sourced the Midnight MCP server: 30 tools in seven categories (search, analysis, repository, versioning, generation, health, compound) with a hosted Compact compiler, so AI assistants can search contracts, compile code and read documentation from the developer’s editor.",
          "Re-architected the documentation for retrieval, with server-side rendering and an llms.txt index, so LLM crawlers and coding agents see full content instead of an app shell.",
          "Launched Midnight Academy, a three-tier zero-knowledge and Compact curriculum (Foundations, Intermediate, Advanced), and produced the accompanying video series.",
          "Tripled the content-bounty programme to 20 published tutorials from 12 contributors by gating open submissions on code that compiles. Quality rose with volume.",
          "Built reference implementations and example dApps that engineers use as starting points, and gave strategic partners high-touch integration support: code reviews, debug sessions and architecture guidance.",
          "Turned partner and community feedback into prioritised, reproducible reports for Engineering, working across Solutions Engineering and Technical Writing.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "The MCP server passed 10,000 downloads and served more than 11,900 tool calls from AI agents, a channel that did not exist before. Midnight Academy enrolled 1,576 developers and certified more than 1,120 of them. The docs became something an agent could actually use, and partner onboarding friction was tracked and reduced instead of guessed at.",
          "In 2026 Midnight standardised on two official tools, Kapa MCP for documentation Q&A and Midnight Expert for hands-on development, and midnight-mcp is being wound down. The package still installs and every tool carries the migration notice.",
        ],
      },
    ],
    links: [
      { label: "midnight-mcp on GitHub", href: "https://github.com/Olanetsoft/midnight-mcp" },
      { label: "midnight-mcp on npm", href: "https://www.npmjs.com/package/midnight-mcp" },
      { label: "Midnight documentation", href: "https://docs.midnight.network/" },
    ],
  },
  {
    slug: "axelar-cross-chain-developer-relations",
    org: "Axelar / Interop Labs",
    role: "Developer Relations Engineer",
    period: "2023–25",
    title: "Cutting cross-chain setup time in half for 100,000+ developers",
    summary:
      "Cross-chain apps were hard to start and harder to debug. I built the reference implementation developers actually copied, rewrote the docs, and instrumented the path from first read to first build.",
    story:
      "General Message Passing is a simple idea whose first working example was not. Developers were stitching together contracts, gateway addresses, gas services and tooling from scattered docs, and partners needed someone who could unblock an integration in a call, not a ticket. I wrote foundry-axelar-gmp-example, rewrote the docs with troubleshooting guides, and ran GitHub and Discord triage.",
    output: {
      items: ["Setup time −55%", "500+ adopters of the reference repo", "Docs usage +120%", "4.8/5 developer satisfaction"],
      mark: 0,
      source: "github.com/axelarnetwork/foundry-axelar-gmp-example",
      href: "https://github.com/axelarnetwork/foundry-axelar-gmp-example",
      asOf: "2026-09-11",
    },
    skipped:
      "I instrumented the funnel from first read to first build, so blockers came from data rather than Discord anecdotes.",
    exhibit: "axelarCommands",
    stack: "Solidity, Foundry, TypeScript, Axelar GMP, Interchain Token Service",
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "Axelar connects blockchains through General Message Passing (GMP). The idea is simple; the first working example was not. Developers were stitching together contracts, gateway addresses, gas services and tooling from scattered docs, and strategic partners needed someone who could unblock an integration in a call, not a ticket.",
        ],
      },
      {
        heading: "What I did",
        bullets: [
          "Built foundry-axelar-gmp-example, a Foundry/Solidity reference implementation for on-chain message passing that reduced cross-chain dApp setup time by 55% and was adopted by 500+ developers.",
          "Rewrote and expanded the documentation with interactive tutorials and troubleshooting guides, increasing documentation usage by 120%.",
          "Provided go-to-market and integration support for strategic partners: scoping technical pilots, designing and validating technical blueprints, and acting as solution architect for their launches.",
          "Engaged more than 100,000 developers through conference talks, live demos, workshops and hackathon activations, including Osmocon Paris and DevFest Lagos.",
          "Ran GitHub and Discord triage and pair-programming sessions, earning a 4.8/5 developer satisfaction score.",
          "Instrumented the developer activation funnel, tracking onboarding to first build, so adoption blockers were found in data rather than anecdotes.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "The reference implementation became the default starting point for teams building on Axelar, documentation usage more than doubled, and partner launches shipped with fewer surprises because someone had already walked the path and written it down.",
        ],
      },
    ],
    links: [
      {
        label: "foundry-axelar-gmp-example",
        href: "https://github.com/axelarnetwork/foundry-axelar-gmp-example",
      },
      {
        label: "DevFest Lagos interchain demo",
        href: "https://github.com/Olanetsoft/devfest-lagos-student-edition-demo-with-axelar",
      },
    ],
  },
  {
    slug: "web3-afrika-builders-community",
    org: "Web3 Afrika",
    role: "Founder",
    period: "2022–present",
    title: "From a Discord server to a 15,000-builder community and a summit stage",
    summary:
      "African builders were under-served by global Web3 ecosystems. I founded a community, then the events and programmes around it, and it became the on-ramp for thousands of developers across the continent.",
    story:
      "In 2022 there was no shortage of talent in African tech, but Web3 ecosystems were designed around builders elsewhere: events in other time zones, grants for other markets, few local peers. I started Web3 Afrika, backed by Developer DAO, then the events around it: the Build Afrika Summit and Blockfest Africa.",
    output: {
      items: ["15,000+ builders", "12,000 participants from 50+ countries at Blockfest Africa 2025", "20+ events"],
      mark: 1,
      source: "BusinessDay",
      href: "https://businessday.ng/news/article/blockfest-africa-2025-draws-12000-participants-strengthens-africas-web3-voice/",
      asOf: "2025",
    },
    skipped:
      "Winning hackathon teams were converted into live ecosystem integrations, not just paid a prize.",
    exhibit: "pressHeadline",
    stack: "Community operations, hackathons, sponsor partnerships, Discord",
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "In 2022 there was no shortage of talent in African tech, but Web3 ecosystems were designed around builders elsewhere: events in other time zones, grants aimed at other markets, and few local peers to learn from. I started Web3 Afrika to change that, backed by Developer DAO.",
        ],
      },
      {
        heading: "What I did",
        bullets: [
          "Grew the community to more than 15,000 Web3 builders across Africa through workshops, study groups and open programmes that onboard, support and educate.",
          "Founded and led the Build Afrika Summit, and organised Blockfest Africa (multi-city) and the Monad Lagos hackathon among 20+ developer events.",
          "Operated hackathons end to end: budgeting, sponsor partnerships, judging, and converting winning teams into active ecosystem integrations.",
          "Delivered the Blockfest Africa 2025 keynote, “Beyond H-1B: Building Global Tech Careers from Africa”, to an audience drawn from 50+ countries.",
          "Built relationships with ecosystems and sponsors so African builders had a direct line to the protocols they were building on.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "Web3 Afrika became one of the most active builder communities on the continent, and the work has been covered by Business Insider Africa, BusinessDay and Technext. More importantly, thousands of developers found their first hackathon, first grant or first job through it.",
        ],
      },
    ],
    links: [
      { label: "web3afrika.com", href: "https://web3afrika.com/" },
      {
        label: "Business Insider Africa profile",
        href: "https://africa.businessinsider.com/local/lifestyle/meet-idris-olubisi-the-nigerian-web3-pioneer-building-africas-next-generation-of-tech/w89mmn5",
      },
    ],
  },
  {
    slug: "technical-writing-ten-million-views",
    org: "freeCodeCamp, LogRocket and others",
    role: "Technical author",
    period: "2021–present",
    title: "Writing that has taught more than ten million developers",
    summary:
      "Good tutorials are the cheapest, most scalable form of developer relations. I have written 40+ of them on the platforms developers already trust, and they keep compounding.",
    story:
      "Every tutorial started as a question a developer asked me in a Discord, at a workshop or in a GitHub issue. The article answers it end to end with code that runs, and it is published where that developer already reads: freeCodeCamp, LogRocket, Dev.to, Moralis, Section, Hashnode.",
    output: {
      items: ["10,000,000+ views across platforms", "100,000+ a month on freeCodeCamp", "40+ tutorials, 200,000+ readers a year on the blog"],
      source: "freeCodeCamp author page",
      href: "https://www.freecodecamp.org/news/author/idris/",
      asOf: "2026-09-11",
    },
    skipped:
      "The pieces are evergreen and search-led, so they keep working years after publication; several are still the top result for their topic.",
    exhibit: "pressHeadline",
    stack: "Technical writing, developer education, search-led content",
    showOnHome: false,
    sections: [
      {
        heading: "The approach",
        paragraphs: [
          "Every tutorial starts from a question a real developer asked me, in a Discord, at a workshop, in a GitHub issue. The article answers it end to end with code that runs, and it is published where that developer already reads: freeCodeCamp, LogRocket, Dev.to, Moralis, Section, Hashnode.",
          "Because the pieces are evergreen and search-led, they keep working long after publication. Several are still the top result for their topic years later.",
        ],
      },
      {
        heading: "Selected work",
        bullets: [
          "freeCodeCamp: Building full-stack applications with Supabase, React and Next.js.",
          "LogRocket: Mainnet vs. testnet environments, a developer’s guide.",
          "Section: Authentication API design with JWT tokens in Node.js (the companion repo has 150+ stars).",
          "Moralis: Building cross-chain zapper dApps with React and real-time transactions.",
          "Dev.to: Using cloud functions to automate GitHub moderation.",
          "Hashnode: Building and pushing projects to Radicle, a decentralised Git protocol.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "More than ten million views across platforms, 100,000+ monthly on freeCodeCamp alone, and a personal blog of 40+ tutorials read by 200,000+ people a year. For the companies I have worked with, that reach translated directly into developers arriving already half-onboarded.",
        ],
      },
    ],
    links: [
      { label: "freeCodeCamp author page", href: "https://www.freecodecamp.org/news/author/idris/" },
      { label: "blog.idrisolubisi.com", href: "https://blog.idrisolubisi.com/" },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
