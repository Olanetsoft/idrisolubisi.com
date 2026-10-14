export type Talk = {
  event: string;
  /** Omitted when only the event and role are known; the event then stands as the title. */
  title?: string;
  year?: string;
  location?: string;
  kind: "Keynote" | "Talk" | "Workshop" | "Fireside chat" | "Host" | "Lecture" | "Speaker";
  href?: string;
  note?: string;
};

/** Newest first; within a year, by date where known. Never invent a title, year or link. */
export const talks: Talk[] = [
  {
    event: "University of Zurich International Summer School",
    title: "Guest lecture on Midnight",
    year: "2026",
    kind: "Lecture",
  },
  {
    event: "Midnight",
    title: "AI-assisted developer tooling and a demo of the Midnight MCP server",
    year: "2025",
    kind: "Fireside chat",
  },
  {
    event: "Blockfest Africa 2025",
    title: "Beyond H-1B: building global tech careers from Africa",
    year: "2025",
    location: "Lagos",
    kind: "Keynote",
    note: "12,000 participants from 50+ countries",
    href: "https://businessday.ng/news/article/blockfest-africa-2025-draws-12000-participants-strengthens-africas-web3-voice/",
  },
  {
    event: "EthCC (Ethereum Community Conference)",
    year: "2025",
    kind: "Speaker",
  },
  {
    event: "Build Afrika Summit",
    title: "Founder and host",
    year: "2025",
    location: "Lagos",
    kind: "Host",
    href: "https://techpoint.africa/brandpress/the-build-afrika-summit-rallies-africas-top-tech-talent-to-build-the-future-of-decentralization/",
  },
  {
    event: "Devcon (Ethereum developer conference)",
    year: "2024",
    kind: "Speaker",
  },
  {
    event: "Osmocon",
    title: "Cross-chain interoperability with Axelar Network",
    year: "2023",
    location: "Paris",
    kind: "Talk",
    href: "https://www.youtube.com/watch?v=MyhX9-F51V4",
  },
  {
    event: "Mara Developer Campus Club",
    title: "Building and integrating USDC into web applications",
    year: "2022",
    kind: "Workshop",
    href: "https://x.com/olanetsoft/status/1606312523677966337",
  },
  {
    event: "DevFest Lagos",
    title: "Leveraging USDC to efficiently build decentralised applications in Web3",
    year: "2022",
    location: "Lagos",
    kind: "Talk",
    href: "https://www.youtube.com/watch?v=yPr8Zs0-S9o",
  },
  {
    event: "CityJS Conference",
    title: "JavaScript supremacy: building a scalable full-stack application with JavaScript",
    year: "2022",
    location: "Lagos",
    kind: "Talk",
    href: "https://x.com/olanetsoft/status/1580091101293477888",
  },
];

/** What he speaks about, for /llms-full.txt. */
export const speakingTopics = [
  "agent systems and the harness around them",
  "MCP and AI-agent tooling",
  "zero-knowledge proofs",
  "building cross-chain applications",
  "technical writing for developers",
  "building developer communities",
];
