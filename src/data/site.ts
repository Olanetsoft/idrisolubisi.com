export const site = {
  name: "Idris Olubisi",
  handle: "olanetsoft",
  role: "Senior Developer Relations Engineer & AI Engineer",
  title: "Idris Olubisi — Senior Developer Relations Engineer & AI Engineer",
  description:
    "Idris Olubisi (olanetsoft) is a Senior Developer Relations Engineer and AI engineer who helps developers — and AI agents — adopt hard technology. Founder of Web3 Afrika (15,000+ builders), freeCodeCamp author with 10M+ article views, builder of the Midnight MCP server.",
  url: "https://idrisolubisi.com",
  location: "London, United Kingdom",
  availability: "Open to senior DevRel, developer-experience and AI-tooling roles",
  resumeUrl: "/resume.pdf",
  gaId: "G-7MMFT1BXJV",
  photoCredit: "Awesomeness by Oye",
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
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Speaking", href: "/#speaking" },
    { label: "Experience", href: "/#experience" },
    { label: "Writing", href: "/#writing" },
    { label: "Contact", href: "/#contact" },
  ],
  metrics: [
    { value: "10M+", label: "article views across freeCodeCamp, LogRocket & more" },
    { value: "100K+", label: "developers engaged through talks, workshops & programs" },
    { value: "15,000+", label: "builders in Web3 Afrika, the community I founded" },
    { value: "11,900+", label: "AI-agent tool calls served by the Midnight MCP server" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
