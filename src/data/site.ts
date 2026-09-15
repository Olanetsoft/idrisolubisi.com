export const site = {
  name: "Idris Olubisi",
  handle: "olanetsoft",
  role: "Senior Developer Relations Engineer",
  /** Shown as a slash-separated title line under the name. */
  disciplines: ["Developer Relations", "AI Developer Tooling", "Developer Experience", "Solutions Engineering"],
  /** Bio paragraphs. Text inside **double asterisks** is rendered bold. */
  bio: [
    "I own the surface between an infrastructure product and the developers who build on it, and increasingly **their AI agents**. At Midnight I built the open-source **Midnight MCP server** (10,000+ downloads, 11,900+ AI-agent tool calls), re-architected the documentation for LLM retrieval and launched Midnight Academy. Before that I led developer relations at **Axelar** for a global cross-chain developer community, and spent three years as a **backend engineer** on payments and data systems.",
    "I founded **Web3 Afrika**, a community of 15,000+ builders across Africa, and my tutorials on freeCodeCamp and elsewhere have been read **more than ten million times**.",
  ],
  title: "Idris Olubisi — Senior Developer Relations Engineer",
  /** Under 160 characters, for the search snippet. The long description feeds social cards and structured data. */
  metaDescription:
    "Senior Developer Relations Engineer, London. Built the Midnight MCP server, led DevRel at Axelar, founded Web3 Afrika. Open to senior DevRel, DX and AI roles.",
  description:
    "Idris Olubisi is a Senior Developer Relations Engineer in London. Built the open-source Midnight MCP server (10,000+ downloads, 11,900+ AI-agent tool calls), led cross-chain developer relations at Axelar, founded Web3 Afrika (15,000+ builders), freeCodeCamp author read 10M+ times.",
  url: "https://idrisolubisi.com",
  location: "London, United Kingdom",
  email: "heedris2olubisi@gmail.com",
  bookingUrl: "https://calendar.app.google/An4ZtvZHjhSTGrgeA",
  status: "London · open to remote or hybrid · UK Global Talent visa, no sponsorship needed",
  availability:
    "Open to senior developer relations, developer advocacy, developer experience, developer success, forward-deployed engineering and AI-tooling roles. Available now.",
  resumeUrl: "/Idris-Olubisi-CV-2026.pdf",
  gaId: "G-7MMFT1BXJV",
  photoCredit: "Awesomeness by Oye",
  /** Eight cells. Every figure is a real count; the source is in the label or the note. */
  numbers: [
    { value: "7", label: "Years in software, three of them in developer relations" },
    { value: "11,900+", label: "AI-agent tool calls served by the Midnight MCP server" },
    { value: "10,000+", label: "MCP server downloads on npm" },
    { value: "15,000+", label: "Builders in Web3 Afrika, the community I founded" },
    { value: "10M+", label: "Reads of my tutorials across freeCodeCamp and other platforms" },
    { value: "100,000+", label: "Developers engaged through Axelar programmes and events" },
    { value: "2,300+", label: "GitHub stars across my repositories" },
    { value: "3,600+", label: "GitHub contributions in the last twelve months" },
  ],
  /** What I actually do. One sentence and one proof line each. */
  functions: [
    {
      title: "Developer relations",
      text: "Own the developer journey for an infrastructure product: docs, examples, programmes and the feedback loop back into Product and Engineering.",
      proof: "100,000+ developers engaged at Axelar · 4.8/5 developer satisfaction · docs usage +120%",
    },
    {
      title: "AI developer tooling",
      text: "Build the tooling that lets AI coding agents work with a new platform: MCP servers, LLM-readable docs and llms.txt, verified examples.",
      proof: "Midnight MCP server: 30 tools, 10,000+ downloads, 11,900+ agent tool calls",
    },
    {
      title: "Documentation and education",
      text: "Write the tutorial that unblocks the developer, then the curriculum that turns readers into certified builders.",
      proof: "Midnight Academy: 1,576 enrolled, 1,120+ certified · tutorials read 10M+ times",
    },
    {
      title: "Partner and solutions engineering",
      text: "Sit with a partner team on the integration call, validate the architecture, review the code, and turn what blocks them into a report Engineering can act on.",
      proof: "Reference implementation adopted by 500+ teams · cross-chain setup time −55%",
    },
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
    { label: "What I do", href: "/#what-i-do" },
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
    { label: "Speaking", href: "/#speaking" },
    { label: "Writing", href: "/#writing" },
    { label: "Recognition", href: "/#recognition" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
