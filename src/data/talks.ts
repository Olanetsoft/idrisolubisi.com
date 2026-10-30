export type Talk = {
  event: string;
  /** Omitted when only the event and role are known; the event then stands as the title. */
  title?: string;
  year?: string;
  location?: string;
  kind:
    "Keynote" | "Talk" | "Workshop" | "Panel" | "Fireside chat" | "Host" | "Lecture" | "Speaker";
  href?: string;
  note?: string;
  /** Shown as a card at the top of Talks instead of in the On stage list. */
  highlight?: "Keynote" | "Guest lecture";
  /**
   * The event's last day (ISO). Give every new talk one: until that day it is
   * marked upcoming, and once it has passed the newest dated talk becomes the
   * Latest card at the top of Talks.
   */
  date?: string;
};

/** Worked out when the page is built, and again each day (see page.tsx). */
export function isUpcoming(t: Talk): boolean {
  return Boolean(t.date && t.date >= new Date().toISOString().slice(0, 10));
}

/** The most recent talk that has happened, for the Latest card; also rechecked daily. */
export function latestTalk(): Talk | undefined {
  return talks
    .filter((t) => t.date && !t.highlight && !isUpcoming(t))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))[0];
}

/** Newest first; within a year, by date where known. Never invent a title, year or link. */
export const talks: Talk[] = [
  {
    event: "Ogun Digital Summit 2026",
    year: "2026",
    location: "Abeokuta",
    kind: "Speaker",
    href: "https://www.ogundigitalsummit.com/speaker",
    date: "2026-11-26",
  },
  {
    event: "DevFest Ilorin 2026",
    title: "Open source, community and content as a career engine",
    year: "2026",
    location: "Ilorin",
    kind: "Talk",
    href: "https://devfestilorin.com/",
    date: "2026-11-07",
  },
  {
    event: "Blockfest Africa 2026",
    title: "Build your first AI agent: from prompt to autonomous action",
    year: "2026",
    location: "Lagos",
    kind: "Workshop",
    href: "https://blockfestafrica.com/schedule",
    date: "2026-10-22",
  },
  {
    event: "University of Zurich International Summer School",
    title: "On Midnight",
    year: "2026",
    kind: "Lecture",
    highlight: "Guest lecture",
  },
  {
    event: "Midnight",
    title:
      "Bi-weekly fireside chats on AI-assisted developer tooling, including a demo of the Midnight MCP server",
    year: "2025–26",
    kind: "Fireside chat",
  },
  {
    event: "Blockfest Africa 2025",
    title: "Beyond H-1B: building global tech careers from Africa",
    year: "2025",
    location: "Lagos",
    kind: "Keynote",
    note: "12,000 participants from 50+ countries",
    highlight: "Keynote",
    href: "https://businessday.ng/news/article/blockfest-africa-2025-draws-12000-participants-strengthens-africas-web3-voice/",
  },
  {
    event: "ETH Enugu 2025",
    title: "ZK identity for the unbanked: building Sybil-resistant systems without KYC",
    year: "2025",
    location: "Enugu",
    kind: "Talk",
    href: "https://speakerdeck.com/olanetsoft/zk-identity-for-the-unbanked-building-sybil-resistant-systems-without-kyc",
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
    event: "Web3 Lagos Conference 2024",
    title: "DePIN in Africa: blockchain solutions for real-world challenges",
    year: "2024",
    location: "Lagos",
    kind: "Talk",
    href: "https://speakerdeck.com/olanetsoft/depin-in-africa-blockchain-solutions-for-real-world-challenges",
  },
  {
    event: "TIL Conf 2024",
    title: "Building the future web: from websites to dApps with JavaScript",
    year: "2024",
    location: "Online",
    kind: "Talk",
    href: "https://www.youtube.com/watch?v=-BLxkNvtmOc&t=11500s",
  },
  {
    event: "DevFest Lagos 2023",
    title: "Building a secure interchain messaging dApp: a technical deep dive",
    year: "2023",
    location: "Lagos",
    kind: "Talk",
    href: "https://2023.devfestlagos.com/schedule",
  },
  {
    event: "Code Africa Conference 2023",
    title: "Smart contract development with Solidity: a beginner’s guide",
    year: "2023",
    location: "Online",
    kind: "Talk",
    href: "https://speakerdeck.com/olanetsoft/smart-contract-development-with-solidity-a-beginners-guide",
  },
  {
    event: "DevFest Uyo 2023",
    title: "Navigating the frontiers of high technology: trends, challenges and opportunities",
    year: "2023",
    location: "Uyo",
    kind: "Panel",
    href: "https://gdg.community.dev/events/details/google-gdg-uyo-presents-devfest-uyo-2023",
  },
  {
    event: "Google Developer Student Club, University of Lagos",
    title: "Initiating your open source Web3 journey",
    year: "2023",
    location: "Lagos",
    kind: "Talk",
    href: "https://speakerdeck.com/olanetsoft/initiating-your-open-source-web3-journey",
  },
  {
    event: "Polygon Guild Abuja",
    title: "Build a full-stack interchain dApp on Polygon with Axelar",
    year: "2023",
    location: "Abuja",
    kind: "Workshop",
    href: "https://speakerdeck.com/olanetsoft/polygon-guild-abuja-workshop",
  },
  {
    event: "Web3 Lagos Conference 2023",
    title: "Breaking into DevRel",
    year: "2023",
    location: "Lagos",
    kind: "Talk",
    href: "https://speakerdeck.com/olanetsoft/breaking-into-devrel",
  },
  {
    event: "Web3 Lagos Conference 2023",
    title: "Building a full-stack interchain dApp with Axelar",
    year: "2023",
    location: "Lagos",
    kind: "Workshop",
    href: "https://speakerdeck.com/olanetsoft/web3-lagos-building-a-full-stack-interchain-dapp-with-axelar",
  },
  {
    event: "CMX Connect Ilorin",
    title:
      "Fostering inclusive communities: empowering diverse voices for creativity and innovation",
    year: "2023",
    location: "Online",
    kind: "Talk",
    href: "https://www.youtube.com/watch?v=5Vkob-nlioI",
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
    event: "OSCAFEST 2023",
    title: "Demystifying Web3: a guide to blockchain interoperability",
    year: "2023",
    location: "Lagos",
    kind: "Talk",
    href: "https://www.youtube.com/watch?v=o07nwFkce-Q",
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
    event: "DevFest Ajah 2022",
    year: "2022",
    location: "Lagos",
    kind: "Speaker",
    href: "https://gdg.community.dev/events/details/google-gdg-ajah-presents-devfest-ajah-2022/",
  },
  {
    event: "DevFest Nairobi 2022",
    title: "A deep dive into stablecoins in web applications",
    year: "2022",
    location: "Nairobi",
    kind: "Talk",
    href: "https://gdg.community.dev/events/details/google-gdg-nairobi-presents-devfest-nairobi-2022/",
  },
  {
    event: "Web3 Developer Roadshow (Mara × Circle)",
    title: "The power of Circle APIs, and building and deploying a USDC-based smart contract",
    year: "2022",
    location: "Lagos and Nairobi",
    kind: "Workshop",
    href: "https://blog.idrisolubisi.com/dev-retro-2022-the-highs-and-lows-of-a-year-to-remember",
  },
  {
    event: "CityJS Conference",
    title: "JavaScript supremacy: building a scalable full-stack application with JavaScript",
    year: "2022",
    location: "Lagos",
    kind: "Talk",
    href: "https://x.com/olanetsoft/status/1580091101293477888",
  },
  {
    event: "Web3 Lagos Conference 2022",
    title: "The Web3 stack",
    year: "2022",
    location: "Lagos",
    kind: "Talk",
    href: "https://technext24.com/crypto/key-takes-from-web3-lagos-conference/",
  },
  {
    event: "OSCAFEST 2022",
    title: "How to indulge your need for technical writing as a developer",
    year: "2022",
    location: "Lagos",
    kind: "Talk",
    href: "https://www.youtube.com/watch?v=iPdtAjb_4b0",
  },
];

/** Photographs of him on stage, his own, opening the Talks section. The first one leads, larger. */
export type StagePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** A short tag on the picture: the event, and the city and year when known. */
  tag: string;
  /** Where the crop centres, as CSS object-position (the speaker is off-centre in some). */
  position?: string;
};

export const stagePhotos: StagePhoto[] = [
  {
    src: "/images/talks/blockfest-keynote.jpg",
    width: 1600,
    height: 1066,
    alt: "Idris at a clear lectern, speaking to a full hall at Blockfest Africa",
    tag: "Keynote · Blockfest Africa · Lagos 2025",
    position: "70% 50%",
  },
  {
    src: "/images/talks/mara-roadshow-stage.jpg",
    width: 1600,
    height: 739,
    alt: "Idris presenting from the stage to rows of developers at long tables, with cameras and lights around the room",
    tag: "Mara × Circle roadshow · 2022",
    position: "96% 50%",
  },
  {
    src: "/images/talks/build-afrika.jpg",
    width: 1600,
    height: 1280,
    alt: "Idris speaking at a lectern at Build Afrika, to a room of developers",
    tag: "Build Afrika · Lagos 2025",
    position: "40% 55%",
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
