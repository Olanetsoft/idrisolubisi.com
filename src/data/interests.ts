export type Interest = {
  name: string;
  url: string;
};

/**
 * What I am currently building with, reading and experimenting on.
 * Edit freely; keep it to what you would happily talk about for ten minutes.
 */
export const interests: Interest[] = [
  { name: "Model Context Protocol", url: "https://modelcontextprotocol.io" },
  { name: "Claude Code and the Claude Agent SDK", url: "https://docs.claude.com" },
  { name: "Midnight and zero-knowledge circuits", url: "https://midnight.network" },
  { name: "Axelar cross-chain messaging", url: "https://www.axelar.network" },
  { name: "llms.txt and docs for AI agents", url: "https://llmstxt.org" },
  { name: "Foundry", url: "https://getfoundry.sh" },
  { name: "Base", url: "https://www.base.org" },
  { name: "LangChain", url: "https://www.langchain.com" },
  { name: "n8n", url: "https://n8n.io" },
  { name: "Supabase", url: "https://supabase.com" },
  { name: "Next.js", url: "https://nextjs.org" },
  { name: "Docusaurus", url: "https://docusaurus.io" },
];

export const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
