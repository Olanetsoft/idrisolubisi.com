export type CaseStudyLink = { label: string; href: string };
export type CaseStudyMetric = { value: string; label: string };
export type CaseStudySection = { heading: string; paragraphs?: string[]; bullets?: string[] };

export type CaseStudy = {
  slug: string;
  org: string;
  role: string;
  period: string;
  title: string;
  /** One-line hook shown on the home page card. */
  summary: string;
  tags: string[];
  metrics: CaseStudyMetric[];
  sections: CaseStudySection[];
  links: CaseStudyLink[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "midnight-agent-era-devrel",
    org: "Midnight",
    role: "Senior Developer Relations Engineer",
    period: "2025 — 2026",
    title: "Making a zero-knowledge blockchain buildable by humans and AI agents",
    summary:
      "The first developer to touch a new stack is now often an AI coding agent. I built the open-source Midnight MCP server, re-architected the docs for LLM retrieval, and launched a three-tier ZK curriculum.",
    tags: ["MCP", "AI agents", "Zero-knowledge", "Documentation", "Developer education"],
    metrics: [
      { value: "10,000+", label: "MCP server downloads" },
      { value: "11,900+", label: "AI-agent tool calls served" },
      { value: "1,120+", label: "developers certified via Midnight Academy" },
      { value: "3×", label: "growth in the content-bounty program" },
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "Midnight is a data-protection blockchain for confidential smart contracts. Building on it means learning a new language (Compact), zero-knowledge circuits and a proof server — a steep curve even for experienced engineers.",
          "By 2025 the curve had a new shape. Developers arrived with Claude, Cursor or Copilot open, and the agent was the first thing to read the docs. Documentation rendered client-side and written only for humans was, to an agent, a wall of JavaScript. Partners were losing days on onboarding friction the team could not see.",
        ],
      },
      {
        heading: "What I built",
        bullets: [
          "Shipped and open-sourced the Midnight MCP (Model Context Protocol) server: 40 tools over 91 indexed repositories with a hosted Compact compiler, so AI assistants can search contracts, compile code and read documentation directly from the developer's editor.",
          "Re-architected the documentation for retrieval — server-side rendering plus an llms.txt index — so LLM crawlers and coding agents see full content instead of an app shell.",
          "Launched Midnight Academy, a three-tier zero-knowledge + Compact curriculum (Foundations, Intermediate, Advanced), and produced the accompanying video series.",
          "Tripled the content-bounty program to 20 published tutorials from 12 contributors by gating open submissions on code that compiles — quality rose with volume.",
          "Built reference implementations and example dApps that engineers use as starting points, and gave strategic partners high-touch integration support: code reviews, debug sessions and architecture guidance.",
          "Turned partner and community feedback into prioritised, reproducible reports for Engineering, working across Solutions Engineering and Technical Writing.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "The MCP server passed 10,000 downloads and served more than 11,900 tool calls from AI agents — a channel that did not exist before. Midnight Academy enrolled 1,576 developers and certified more than 1,120 of them. The docs became something an agent could actually use, and partner onboarding friction was tracked and reduced instead of guessed at.",
        ],
      },
    ],
    links: [
      { label: "Midnight MCP server on GitHub", href: "https://github.com/Olanetsoft/midnight-mcp" },
      { label: "Midnight documentation", href: "https://docs.midnight.network/" },
    ],
  },
  {
    slug: "axelar-cross-chain-developer-relations",
    org: "Axelar / Interop Labs",
    role: "Developer Relations Engineer",
    period: "2023 — 2025",
    title: "Cutting cross-chain setup time in half for 100,000+ developers",
    summary:
      "Cross-chain apps were hard to start and harder to debug. I built the reference implementation developers actually copied, rewrote the docs, and instrumented the path from first read to first build.",
    tags: ["Interoperability", "Solidity", "Foundry", "Documentation", "Partner engineering"],
    metrics: [
      { value: "55%", label: "less time to a working cross-chain dApp" },
      { value: "+120%", label: "documentation usage after the rewrite" },
      { value: "4.8 / 5", label: "developer satisfaction score" },
      { value: "100K+", label: "developers engaged worldwide" },
    ],
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
          "Provided go-to-market and integration support for strategic partners — scoping technical pilots, designing and validating technical blueprints, and acting as solution architect for their launches.",
          "Engaged more than 100,000 developers through conference talks, live demos, workshops and hackathon activations, including Osmocon Paris and DevFest Lagos.",
          "Ran GitHub and Discord triage and pair-programming sessions, earning a 4.8/5 developer satisfaction score.",
          "Instrumented the developer activation funnel — tracking onboarding-to-first-build — so adoption blockers were found in data rather than anecdotes.",
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
    period: "2022 — present",
    title: "Growing a 15,000-builder community from a Discord server to a summit stage",
    summary:
      "African builders were under-served by global Web3 ecosystems. I founded a community, then the events and programs around it — and it became the on-ramp for thousands of developers across the continent.",
    tags: ["Community", "Events", "Hackathons", "Ecosystem growth", "Africa"],
    metrics: [
      { value: "15,000+", label: "builders across Africa" },
      { value: "12,000+", label: "participants at Blockfest Africa 2025" },
      { value: "50+", label: "countries represented" },
      { value: "20+", label: "developer events organised" },
    ],
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
          "Grew the community to more than 15,000 Web3 builders across Africa through workshops, study groups and open programs that onboard, support and educate.",
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
    org: "freeCodeCamp, LogRocket & more",
    role: "Technical author",
    period: "2021 — present",
    title: "Writing that has taught more than ten million developers",
    summary:
      "Good tutorials are the cheapest, most scalable form of developer relations. I've written 40+ of them across the platforms developers already trust — and they keep compounding.",
    tags: ["Technical writing", "Developer education", "Content strategy", "SEO"],
    metrics: [
      { value: "10M+", label: "total article views" },
      { value: "100K+", label: "monthly views on freeCodeCamp" },
      { value: "200K+", label: "annual readers on my own blog" },
      { value: "8,800+", label: "Hashnode followers" },
    ],
    sections: [
      {
        heading: "The approach",
        paragraphs: [
          "Every tutorial starts from a question a real developer asked me — in a Discord, at a workshop, in a GitHub issue. The article answers it end to end with code that runs, and it is published where that developer already reads: freeCodeCamp, LogRocket, Dev.to, Moralis, Section, Hashnode.",
          "Because the pieces are evergreen and search-led, they keep working long after publication. Several are still the top result for their topic years later.",
        ],
      },
      {
        heading: "Selected work",
        bullets: [
          "freeCodeCamp — Building full-stack applications with Supabase, React and Next.js.",
          "LogRocket — Mainnet vs. testnet environments: a developer's guide.",
          "Section — Authentication API design with JWT tokens in Node.js (the companion repo has 150+ stars).",
          "Moralis — Building cross-chain zapper dApps with React and real-time transactions.",
          "Dev.to — Using cloud functions to automate GitHub moderation.",
          "Hashnode — Building and pushing projects to Radicle, a decentralised Git protocol.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "More than ten million views across platforms, 100,000+ monthly on freeCodeCamp alone, and a personal blog of 40+ tutorials read by 200,000+ people a year. For the companies I've worked with, that reach translated directly into developers arriving already half-onboarded.",
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
