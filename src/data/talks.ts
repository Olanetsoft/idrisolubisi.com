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

/** Newest first. Never invent a title, year or link. */
export const talks: Talk[] = [
  {
    event: "Devcon (Ethereum developer conference)",
    kind: "Speaker",
  },
  {
    event: "ETHCC (Ethereum Community Conference)",
    kind: "Speaker",
  },
  {
    event: "University of Zurich International Summer School",
    title: "Guest lecture on Midnight",
    year: "2026",
    kind: "Lecture",
  },
  {
    event: "Blockfest Africa 2025",
    title: "Beyond H-1B: Building Global Tech Careers from Africa",
    year: "2025",
    location: "Lagos",
    kind: "Keynote",
    note: "12,000 participants from 50+ countries",
    href: "https://businessday.ng/news/article/blockfest-africa-2025-draws-12000-participants-strengthens-africas-web3-voice/",
  },
  {
    event: "Build Afrika Summit",
    title: "Founder and host: Africa’s builders, protocols and partners in one room",
    year: "2025",
    location: "Lagos",
    kind: "Host",
    href: "https://techpoint.africa/brandpress/the-build-afrika-summit-rallies-africas-top-tech-talent-to-build-the-future-of-decentralization/",
  },
  {
    event: "Midnight",
    title: "AI-assisted developer tooling and a live MCP server demo",
    year: "2025",
    kind: "Fireside chat",
  },
  {
    event: "Osmocon",
    title: "Cross-Chain Interoperability with Axelar Network",
    year: "2023",
    location: "Paris",
    kind: "Talk",
    href: "https://www.osmocon.com/#speakers",
  },
  {
    event: "DevFest Lagos",
    title: "Leveraging USDC to build decentralised applications in Web3 efficiently",
    year: "2022",
    location: "Lagos",
    kind: "Talk",
    href: "https://www.youtube.com/watch?v=yPr8Zs0-S9o",
  },
  {
    event: "CityJS Conference",
    title: "JavaScript Supremacy: Building a scalable full-stack application with JavaScript",
    year: "2022",
    kind: "Talk",
    href: "https://x.com/olanetsoft/status/1580091101293477888",
  },
  {
    event: "Mara Developer Campus Club",
    title: "Building and integrating USDC into web applications",
    year: "2022",
    kind: "Workshop",
    href: "https://x.com/olanetsoft/status/1606312523677966337",
  },
];
