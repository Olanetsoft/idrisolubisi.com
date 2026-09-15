export type Interest = {
  name: string;
  url: string;
};

/**
 * Broad themes I am currently building with, reading and experimenting on,
 * across developer relations, software engineering and AI engineering.
 * Each links to one canonical reference. Edit freely.
 */
export const interests: Interest[] = [
  { name: "AI agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
  { name: "Harness engineering", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
  { name: "Model Context Protocol", url: "https://modelcontextprotocol.io" },
  { name: "LangChain", url: "https://www.langchain.com" },
  { name: "Documentation for AI agents", url: "https://llmstxt.org" },
  { name: "Zero-knowledge proofs", url: "https://zkproof.org" },
  { name: "Cross-chain interoperability", url: "https://www.axelar.network" },
  { name: "Developer relations", url: "https://developerrelations.com" },
];

export const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
