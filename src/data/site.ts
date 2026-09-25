export const site = {
  name: "Idris Olubisi",
  handle: "olanetsoft",
  role: "Senior Developer Relations Engineer",
  /** Used in /llms.txt and structured data; the page shows `role` as the headline. */
  disciplines: [
    "Developer Relations",
    "AI Engineer",
    "Developer Experience",
    "Solutions Engineering",
  ],
  /** Bio paragraphs, plain prose; [label](url) renders as a link. */
  bio: [
    "I help developers succeed on technical products. I build the tools, guides, and programs that take an engineer from first look to production, and I’ve done it for developer platforms in AI and blockchain since 2019. Most recently at Midnight and Axelar. Founder of [Web3 Afrika](https://web3afrika.com/), a developer community.",
  ],
  title: "Idris Olubisi, Senior Developer Relations Engineer",
  /** Under 160 characters, for the search snippet. The long description feeds social cards and structured data. */
  metaDescription:
    "Senior Developer Relations Engineer in London. I help developers succeed on technical products, most recently at Midnight and Axelar. Available now.",
  description:
    "Idris Olubisi is a Senior Developer Relations Engineer in London who helps developers succeed on technical products: the tools, guides and programs that take an engineer from first look to production, for developer platforms in AI and blockchain since 2019. Most recently at Midnight and Axelar. Founder of Web3 Afrika, a developer community.",
  url: "https://idrisolubisi.com",
  email: "heedris2olubisi@gmail.com",
  bookingUrl: "https://calendar.app.google/An4ZtvZHjhSTGrgeA",
  status: "UK Global Talent",
  availability:
    "Open to developer relations, developer experience, developer support, solutions engineering, and AI engineering roles. Available now.",
  /** View-only PDF, refreshed from the Google Doc with `npm run cv`. */
  resumeUrl: "/Idris-Olubisi-CV.pdf",
  gaId: "G-7MMFT1BXJV",
  /** What I actually do. One sentence each. */
  functions: [
    {
      title: "Developer relations",
      text: "Help developers understand and adopt a product, and bring their feedback back to the product and engineering teams.",
    },
    {
      title: "Developer tools and AI",
      text: "Build tools that make a product easier to use, including AI-powered tools and ones that run AI models locally.",
    },
    {
      title: "Documentation and education",
      text: "Write guides and build courses that turn readers into working builders.",
    },
    {
      title: "Partner and solutions engineering",
      text: "Work directly with partner teams on design, integration, and code review, through to launch.",
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
  },
} as const;
