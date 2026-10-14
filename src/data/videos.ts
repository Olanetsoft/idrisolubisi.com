/**
 * The recordings shown under "Talks and workshops": a hand-picked mix across
 * the career rather than the latest uploads. Midnight tutorials (the most
 * watched) and his Midnight MCP explainer, Axelar workshops, an MCP workshop,
 * an explainer and a DevRel interview. Every one was checked to be public, with Idris on camera.
 * Titles are cleaned up for the card; no em-dashes. Ordered so neighbours in
 * the 3x3 grid differ.
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
    title: "Build and Ship Your First MCP Server",
    kind: "Workshop",
    context: "AI engineering",
    year: "2026",
    start: 828,
  },
  {
    id: "v11GCdJ5ELE",
    title: "Build a Multichain RWA Lending Platform",
    kind: "Workshop",
    context: "Axelar x Moralis",
    year: "2024",
  },
  {
    id: "j6KF0qWJw08",
    title: "Tracking and Troubleshooting Cross-Chain Transactions",
    kind: "Workshop",
    context: "Axelar",
    year: "2024",
  },
  {
    id: "oGDSMDejUkE",
    title: "Midnight MCP: The AI Tool That Understands Compact",
    kind: "Explainer",
    context: "Midnight",
    year: "2026",
  },
  {
    id: "u9jnQJQITfs",
    title: "Stop Copy-Pasting Code Into ChatGPT",
    kind: "Explainer",
    context: "AI tools",
    year: "2026",
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
    title: "Build a Farcaster Frame That Sends Multichain Messages",
    kind: "Workshop",
    context: "Axelar GMP",
    year: "2024",
  },
  {
    id: "5BGkt7d6fNw",
    title: "Midnight UTXO and Account Model",
    kind: "Tutorial",
    context: "Midnight",
    year: "2025",
  },
];
