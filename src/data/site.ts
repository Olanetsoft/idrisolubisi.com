export const site = {
  name: "Idris Olubisi",
  handle: "olanetsoft",
  role: "Senior Developer Relations Engineer",
  /** Shown as a slash-separated title line under the name. */
  disciplines: ["Developer Relations", "AI Engineer", "Developer Experience", "Solutions Engineering"],
  /** Bio paragraphs. Text inside **double asterisks** is rendered bold. */
  bio: [
    "I own the surface between an infrastructure product and the developers who build on it, and increasingly **their AI agents**. Seven years across backend engineering and developer relations, most recently at **Midnight** and **Axelar**; founder of **Web3 Afrika**, a community of 15,000+ builders. I am most satisfied when a developer I helped ships to production.",
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
  status: "London · remote or hybrid · UK Global Talent visa",
  availability:
    "Open to senior DevRel, developer experience, developer success, forward-deployed and AI engineering roles. Available now.",
  resumeUrl: "/Idris-Olubisi-CV-2026.pdf",
  gaId: "G-7MMFT1BXJV",
  photoCredit: "Awesomeness by Oye",
  /** Eight cells. Every figure is a real count; the source is in the label or the note. */
  numbers: [
    { value: "7", label: "Years in software" },
    { value: "11,900+", label: "AI-agent tool calls served" },
    { value: "10,000+", label: "MCP server downloads" },
    { value: "15,000+", label: "Web3 Afrika builders" },
    { value: "10M+", label: "Tutorial reads" },
    { value: "100,000+", label: "Developers engaged at Axelar" },
    { value: "2,300+", label: "GitHub stars" },
    { value: "3,600+", label: "GitHub contributions, past year" },
  ],
  /** What I actually do. One sentence each. */
  functions: [
    {
      title: "Developer relations",
      text: "Docs, examples, programmes and the feedback loop from developers back into Product and Engineering.",
    },
    {
      title: "AI engineering",
      text: "MCP servers, LLM-readable documentation and the tooling that lets AI coding agents build on a new platform.",
    },
    {
      title: "Documentation and education",
      text: "Tutorials that unblock developers, and curricula that turn readers into certified builders.",
    },
    {
      title: "Partner and solutions engineering",
      text: "Integration calls, architecture reviews and code reviews with partner teams, through to launch.",
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
