export const site = {
  name: "Idris Olubisi",
  handle: "olanetsoft",
  role: "Senior Developer Relations Engineer",
  /** Used in /llms.txt and structured data; the page shows `role` as the headline. */
  disciplines: [
    "Developer Relations",
    "AI Engineer",
    "Forward Deployed Engineering",
    "Developer Experience",
    "Solutions Engineering",
  ],
  /** The hero intro: one paragraph, no employer names. [label](url) renders as a link, ==text== as the one highlight. */
  bio: [
    "I work alongside the developers and builders using a product, ==find the step that actually costs them time==, and ship the fix. I’ve done it since 2019, writing tutorials and production code across backend engineering and developer relations. Now I build AI agents and their safety checks: around 100 people trade real money through agents on a platform I built.",
  ],
  title: "Idris Olubisi, Senior Developer Relations Engineer",
  /** Evergreen, no employer or availability: the search snippet and every social card. The long description feeds structured data. */
  metaDescription:
    "Idris Olubisi (olanetsoft) is a Senior Developer Relations Engineer, founder of Web3 Afrika, and freeCodeCamp author with tutorials read 10M+ times. Built the Midnight MCP server: 10,000+ downloads and 11,900+ AI-agent tool calls.",
  description:
    "Idris Olubisi is a UK-based engineer in developer relations, AI and forward deployed engineering. He works alongside developers and builders, finds the step that costs them time, and ships the fix. Since 2019 he has written tutorials and production code; now he builds AI agents and their safety checks.",
  url: "https://idrisolubisi.com",
  email: "heedris2olubisi@gmail.com",
  bookingUrl: "https://calendar.app.google/An4ZtvZHjhSTGrgeA",
  status: "UK Global Talent",
  availability:
    "Open to developer relations, AI engineering, forward deployed engineering, solutions engineering, developer experience and developer support roles.",
  /** View-only PDF, refreshed from the Google Doc with `npm run cv`. */
  resumeUrl: "/Idris-Olubisi-CV.pdf",
  gaId: "G-7MMFT1BXJV",
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
  },
} as const;
