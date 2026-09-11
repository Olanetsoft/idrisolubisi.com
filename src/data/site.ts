export const site = {
  name: "Idris Olubisi",
  handle: "olanetsoft",
  role: "Senior Developer Relations Engineer",
  title: "Idris Olubisi — Senior Developer Relations Engineer",
  description:
    "Idris Olubisi (olanetsoft), Senior Developer Relations Engineer, London. Built the open-source Midnight MCP server (10,000+ downloads, 11,900+ AI-agent tool calls), re-architected docs for LLM retrieval, founded Web3 Afrika (15,000+ builders), freeCodeCamp author read 10M+ times.",
  url: "https://idrisolubisi.com",
  location: "London, United Kingdom",
  origin: "Lagos",
  /** Set to publish a mailto link in the Contact section. Leave empty to rely on the form and DMs. */
  email: "",
  availability: {
    lookingFor:
      "senior developer relations, developer advocacy, developer experience, developer success, forward-deployed engineering or AI-tooling roles",
    from: "Available now. London, or remote.",
    rightToWork: "UK Global Talent visa. No sponsorship needed.",
    before:
      "Midnight (2025–26), Axelar / Interop Labs (2023–25), Mara in Nairobi (2022–23); backend engineer at Luna, PhilanthroLab and Hotels.ng before that.",
  },
  resumeUrl: "/Idris-Olubisi-CV-2026.pdf",
  gaId: "G-7MMFT1BXJV",
  photoCredit: "Awesomeness by Oye",
  figures: {
    toolCalls: {
      // Replace with the exact integer and a linkable source before publishing.
      value: "11,900+",
      unit: "tool calls served to AI agents by midnight-mcp",
      asOf: "Sep 2026",
      source: "midnight-mcp server telemetry",
      href: "https://github.com/Olanetsoft/midnight-mcp",
      note: "The one number on this page I would defend in an interview.",
    },
    downloads: {
      value: "10,000+",
      asOf: "Sep 2026",
      source: "npm",
      href: "https://www.npmjs.com/package/midnight-mcp",
    },
  },
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
    { label: "Work", href: "/#work" },
    { label: "Talks", href: "/#talks" },
    { label: "Writing", href: "/#writing" },
    { label: "Career", href: "/#career" },
    { label: "Code", href: "/#code" },
    { label: "Contact", href: "/#contact" },
    { label: "/llms.txt", href: "/llms.txt", mono: true },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
