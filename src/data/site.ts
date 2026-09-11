export const site = {
  name: "Idris Olubisi",
  handle: "olanetsoft",
  role: "Senior Developer Relations Engineer",
  tagline: "AI developer tooling, zero-knowledge and cross-chain infrastructure",
  bio: [
    "I help developers, and increasingly their AI agents, succeed with hard infrastructure. At Midnight I built the open-source Midnight MCP server (10,000+ downloads, 11,900+ AI-agent tool calls), re-architected the documentation for LLM retrieval and launched Midnight Academy. Before that I led developer relations at Axelar for a global cross-chain developer community, and worked as a backend engineer on payments and data systems.",
    "I founded Web3 Afrika, a community of 15,000+ builders across Africa, and my tutorials on freeCodeCamp and elsewhere have been read more than ten million times.",
  ],
  title: "Idris Olubisi — Senior Developer Relations Engineer",
  description:
    "Idris Olubisi is a Senior Developer Relations Engineer in London. Built the open-source Midnight MCP server (10,000+ downloads, 11,900+ AI-agent tool calls), led cross-chain developer relations at Axelar, founded Web3 Afrika (15,000+ builders), freeCodeCamp author read 10M+ times.",
  url: "https://idrisolubisi.com",
  location: "London, United Kingdom",
  /** Set to show a mailto link in Contact. */
  email: "",
  availability:
    "Open to senior developer relations, developer advocacy, developer experience, developer success, forward-deployed engineering and AI-tooling roles. Available now, London or remote. UK Global Talent visa, no sponsorship required.",
  resumeUrl: "/Idris-Olubisi-CV-2026.pdf",
  gaId: "G-7MMFT1BXJV",
  photoCredit: "Awesomeness by Oye",
  highlights: [
    { value: "11,900+", label: "AI-agent tool calls served by the Midnight MCP server" },
    { value: "10,000+", label: "MCP server downloads on npm" },
    { value: "15,000+", label: "builders in Web3 Afrika, the community I founded" },
    { value: "10M+", label: "reads of my tutorials across freeCodeCamp and more" },
  ],
  links: {
    github: "https://github.com/Olanetsoft",
    linkedin: "https://www.linkedin.com/in/idris-olubisi/",
    x: "https://x.com/olanetsoft",
    blog: "https://blog.idrisolubisi.com/",
    youtube: "https://www.youtube.com/playlist?list=PLaZ7cT8J_HZbyPjlfLgFCCpA_rAbKaaqg",
    sessionize: "https://sessionize.com/olanetsoft",
    freecodecamp: "https://www.freecodecamp.org/news/author/idris/",
    devto: "https://dev.to/olanetsoft",
    linktree: "https://linktr.ee/olanetsoft",
    web3afrika: "https://web3afrika.com/",
    source: "https://github.com/Olanetsoft/idrisolubisi.com",
  },
  nav: [
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
    { label: "Speaking", href: "/#speaking" },
    { label: "Writing", href: "/#writing" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
