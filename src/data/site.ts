export const site = {
  name: "Idris Olubisi",
  handle: "olanetsoft",
  role: "Senior Developer Relations Engineer",
  /** Used in /llms.txt and structured data; the page shows `role` as the headline. */
  disciplines: [
    "Developer Relations",
    "AI Agent Engineering",
    "Forward Deployed Engineering",
    "Backend Engineering",
  ],
  /** The hero intro: one paragraph, no employer names. [label](url) renders as a link, ==text== as the one highlight. */
  bio: [
    "I’m a backend engineer who moved into developer relations and now builds AI agents. For seven years I’ve worked alongside the developers and builders using a product, ==finding the step that actually costs them time== and shipping the fix: docs and tutorials, partner integrations or production code.",
  ],
  title: "Idris Olubisi, Senior Developer Relations Engineer",
  /** Evergreen, no employer or availability: the search snippet and every social card. The long description feeds structured data. */
  metaDescription:
    "Idris Olubisi (olanetsoft), Senior Developer Relations Engineer who builds AI agents. Built the Midnight MCP server: 10,000+ downloads. Founder of Web3 Afrika.",
  description:
    "Idris Olubisi is a London-based backend engineer who moved into developer relations and now builds AI agents. For seven years he has worked alongside developers and builders, finding the step that costs them time and shipping the fix: docs and tutorials, partner integrations or production code.",
  /** For /llms-full.txt. */
  profile: {
    pronouns: "He/Him",
    nationality: "Nigerian",
    languages: ["English", "Yoruba"],
    writingSince: "2020",
    xFollowers: "27,000+",
  },
  /** The longer summary for /llms-full.txt. Every figure here is also on the page. */
  summary:
    "Idris Olubisi is a backend engineer turned developer relations engineer, now building agent systems: seven years across backend engineering and developer-facing work (2019 to 2026). He built the open-source Midnight MCP server (10,000+ downloads, 11,900+ AI-agent tool calls), re-architected documentation for AI retrieval, and built SwoopAgent, a multi-tenant platform where around 100 users trade real funds through Claude-powered agents. He founded Web3 Afrika (15,000+ builders across Africa), and his tutorials have been read 10M+ times.",
  /** Checked on github.com on 14 Oct 2026; followers come live from the build. */
  github: {
    publicRepos: "320+",
    achievements: [
      "Pull Shark x4 (gold tier, the badge’s highest)",
      "Starstruck x3 (silver tier; top repository awesome-hackathon-projects, 1,877 stars in Oct 2026)",
    ],
  },
  url: "https://idrisolubisi.com",
  email: "heedris2olubisi@gmail.com",
  bookingUrl: "https://calendar.app.google/An4ZtvZHjhSTGrgeA",
  location: "London",
  status: "UK Global Talent",
  availability:
    "Open to senior developer relations, AI agent engineering, forward deployed engineering and backend engineering roles.",
  /** View-only PDF, refreshed from the Google Doc with `npm run cv`. */
  resumeUrl: "/Idris-Olubisi-CV.pdf",
  gaId: "G-7MMFT1BXJV",
  links: {
    github: "https://github.com/Olanetsoft",
    linkedin: "https://www.linkedin.com/in/idris-olubisi/",
    x: "https://x.com/olanetsoft",
    blog: "https://blog.idrisolubisi.com/",
    youtube: "https://www.youtube.com/playlist?list=PLaZ7cT8J_HZbyPjlfLgFCCpA_rAbKaaqg",
    youtubeChannel: "https://www.youtube.com/@olanetsoft",
    sessionize: "https://sessionize.com/olanetsoft",
    freecodecamp: "https://www.freecodecamp.org/news/author/olanetsoft/",
    devto: "https://dev.to/olanetsoft",
    logrocket: "https://blog.logrocket.com/author/idrisolubisi/",
    medium: "https://medium.com/@olanetsoft",
    linktree: "https://linktr.ee/olanetsoft",
    source: "https://github.com/Olanetsoft/idrisolubisi.com",
    web3afrika: "https://web3afrika.com/",
  },
} as const;
