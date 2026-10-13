/**
 * The recordings shown under "Talks and workshops": a hand-picked mix across
 * the career rather than the latest uploads. Two Midnight tutorials (the most
 * watched), two Axelar workshops, an MCP workshop and an explainer. Every one
 * was checked to be public, with Idris on camera. Titles are cleaned up for
 * the card; no em-dashes.
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
    id: "v11GCdJ5ELE",
    title: "Build a Multichain RWA Lending Platform",
    kind: "Workshop",
    context: "Axelar x Moralis",
    year: "2024",
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
    id: "M6JfvY4-APE",
    title: "Build a Farcaster Frame That Sends Multichain Messages",
    kind: "Workshop",
    context: "Axelar GMP",
    year: "2024",
  },
  {
    id: "u9jnQJQITfs",
    title: "Stop Copy-Pasting Code Into ChatGPT",
    kind: "Explainer",
    context: "AI tools",
    year: "2026",
  },
  {
    id: "5BGkt7d6fNw",
    title: "Midnight UTXO and Account Model",
    kind: "Tutorial",
    context: "Midnight",
    year: "2025",
  },
];
