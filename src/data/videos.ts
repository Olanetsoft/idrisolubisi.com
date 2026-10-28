/**
 * The recordings shown under "Talks and workshops": a hand-picked mix across
 * the career rather than the latest uploads. Midnight tutorials (the most
 * watched) and his Midnight MCP explainer, Axelar workshops, an MCP workshop,
 * an explainer and a DevRel interview. Every one was checked to be public, with Idris on camera.
 * Titles are cleaned up for the card; no em-dashes. Ordered so neighbours in
 * the grid (three to a row, two rows shown) differ.
 */
export type FeaturedVideo = {
  /** YouTube video id; the thumbnail and link are built from it. */
  id: string;
  title: string;
  /** What kind of recording it is. */
  kind: string;
  /** What or where it was about. */
  context: string;
  year: string;
  /** Seconds into the video where his part starts, for shared recordings. */
  start?: number;
  /** A YouTube thumbnail other than hqdefault, when the default frame is unclear. */
  thumb?: string;
};

export const featuredVideos: FeaturedVideo[] = [
  {
    id: "CPquHr_p5Y0",
    title: "NIGHT vs DUST",
    kind: "Tutorial",
    context: "Midnight",
    year: "2026",
  },
  {
    id: "oBxiSKL4NeA",
    title: "Build and ship your first MCP server",
    kind: "Workshop",
    context: "AI agent engineering",
    year: "2026",
    start: 828,
  },
  {
    id: "v11GCdJ5ELE",
    title: "Build a multichain RWA lending platform",
    kind: "Workshop",
    context: "Axelar x Moralis",
    year: "2024",
  },
  {
    id: "j6KF0qWJw08",
    title: "Tracking and troubleshooting cross-chain transactions",
    kind: "Workshop",
    context: "Axelar",
    year: "2024",
  },
  {
    id: "oGDSMDejUkE",
    title: "Midnight MCP: the AI tool that understands Compact",
    kind: "Explainer",
    context: "Midnight",
    year: "2026",
  },
  {
    id: "u9jnQJQITfs",
    title: "Stop copy-pasting code into ChatGPT",
    kind: "Explainer",
    context: "AI tools",
    year: "2026",
    thumb: "hq3",
  },
  {
    id: "f-rWEHVmfDw",
    title: "Navigating DevRel in 2025",
    kind: "Interview",
    context: "Developer relations",
    year: "2025",
  },
  {
    id: "M6JfvY4-APE",
    title: "Build a Farcaster Frame that sends multichain messages",
    kind: "Workshop",
    context: "Axelar GMP",
    year: "2024",
  },
  {
    id: "5BGkt7d6fNw",
    title: "Midnight UTXO and account model",
    kind: "Tutorial",
    context: "Midnight",
    year: "2025",
  },
  {
    id: "9p8n4SBtwRQ",
    title: "Build on Midnight kickoff workshop",
    kind: "Workshop",
    context: "Major League Hacking",
    year: "2026",
  },
  {
    id: "o07nwFkce-Q",
    title: "Demystifying Web3: a guide to blockchain interoperability",
    kind: "Talk",
    context: "OSCAFEST",
    year: "2023",
  },
  {
    id: "5loZw3iDOuo",
    title: "Build a multichain tax contract with ITS",
    kind: "Workshop",
    context: "Axelar",
    year: "2024",
  },
  {
    id: "GoatYgMcyj0",
    title: "Introduction to blockchain",
    kind: "Workshop",
    context: "GitHub Campus Experts x Midnight",
    year: "2026",
  },
  {
    id: "zKS0DYVOGEA",
    title: "A career path in Web3 as a developer",
    kind: "Workshop",
    context: "Web3 Afrika",
    year: "2023",
  },
  {
    id: "NTvxu_Ap9Eg",
    title: "Build privacy-preserving blockchain apps",
    kind: "Tutorial",
    context: "Midnight",
    year: "2025",
  },
];
