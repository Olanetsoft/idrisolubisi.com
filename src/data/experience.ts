export type Role = {
  company: string;
  title: string;
  /** En dash, no spaces, so the period never wraps. */
  period: string;
  location?: string;
  /** One line: what the role was hired for and what it became. */
  scope?: string;
  highlights: string[];
  url?: string;
};

// NOTE: confirm the exact end month of the Midnight role before publishing.
export const experience: Role[] = [
  {
    company: "Midnight",
    title: "Senior Developer Relations Engineer",
    period: "Sep 2025–2026",
    location: "Remote",
    url: "https://midnight.network/",
    scope:
      "Hired for developer relations on a zero-knowledge blockchain; owned the AI-agent developer channel and partner onboarding.",
    highlights: [
      "Built and open-sourced the Midnight MCP server: 30 tools, 10,000+ npm downloads, 11,900+ tool calls served to AI coding agents, a channel that did not exist before.",
      "Re-architected the documentation for LLM retrieval (server-side rendering, llms.txt index) so coding agents see full content instead of an app shell.",
      "Launched Midnight Academy, a three-tier Compact and zero-knowledge curriculum: 1,576 enrolled, 1,120+ certified.",
      "Tripled the content-bounty programme to 20 published tutorials from 12 contributors by gating submissions on code that compiles.",
      "Gave strategic partners integration support end to end: code reviews, debug sessions, architecture guidance, and structured friction reports to Engineering.",
    ],
  },
  {
    company: "Axelar / Interop Labs",
    title: "Developer Relations Engineer",
    period: "Apr 2023–Aug 2025",
    location: "Remote",
    url: "https://www.axelar.network/",
    scope:
      "Hired to grow the cross-chain developer community; became the technical point of contact for partners integrating Axelar.",
    highlights: [
      "Wrote foundry-axelar-gmp-example, the reference implementation for cross-chain messaging: setup time −55%, adopted by 500+ teams.",
      "Rewrote the documentation with interactive tutorials and troubleshooting guides; usage +120%, developer satisfaction 4.8/5.",
      "Engaged 100,000+ developers through talks, workshops and community programmes.",
      "Acted as solution architect for strategic partners: validated technical blueprints and gave go-to-market and integration support through launch.",
    ],
  },
  {
    company: "Mara",
    title: "Developer Relations Engineer",
    period: "Jul 2022–Apr 2023",
    location: "Nairobi",
    scope: "First developer-relations hire; built the developer programme from zero.",
    highlights: [
      "Cut developer onboarding time by 65% with a documentation-to-production workflow.",
      "Scaled the Mara Developer Campus Club from 0 to 18+ universities and reached 30,000+ developers across Africa.",
      "Grew Mara Academy to 19,000+ active developers at 85% monthly retention, and set up the feedback pipeline from the community to Product.",
    ],
  },
  {
    company: "Luna",
    title: "Backend Engineer",
    period: "Dec 2021–Jul 2022",
    location: "London, remote",
    highlights: [
      "Built a multi-tenant payments microservice on Apache Kafka serving 50,000+ users across web and mobile.",
      "Improved application performance by 63% and held 99.9% uptime under high-volume traffic with monitoring and alerting.",
      "Integrated Stripe, PayPal and bank-account payment flows; mentored three junior engineers.",
    ],
  },
  {
    company: "PhilanthroLab",
    title: "Backend Engineer",
    period: "Feb 2021–Dec 2021",
    location: "Dallas, remote",
    highlights: [
      "Designed an automated data lake processing 100 GB+ a month, saving 1,000+ hours of manual retrieval a year.",
      "Improved application performance by 50% on a Node.js, GraphQL, Neo4j and Elasticsearch stack.",
    ],
  },
  {
    company: "Hotels.ng",
    title: "Backend Developer",
    period: "2020–2021",
    location: "Lagos",
    highlights: [
      "Led a team delivering a parser script generator, a talent pool and a customer payments application on Node.js, SQL, MongoDB, Redis and RabbitMQ.",
    ],
  },
  {
    company: "Tavia Technologies",
    title: "Software Developer / Support Analyst",
    period: "Apr 2019–2020",
    location: "Lagos",
    highlights: [
      "Automated business processes for MTN Nigeria, NPDC and Access Bank, saving 900+ hours a year.",
      "Delivered custom SharePoint and .NET Core solutions with zero data loss across deployments.",
    ],
  },
];

export const education = {
  degree: "B.Eng. Electrical & Electronics Engineering",
  school: "Abubakar Tafawa Balewa University, Bauchi",
  year: "2018",
};

export const community = [
  { org: "Web3 Afrika", role: "Founder", href: "https://web3afrika.com/" },
  { org: "SheCodeAfrica", role: "backend community lead", href: "https://shecodeafrica.org/" },
  { org: "Open Source Community Africa", role: "OSCA Hero, Yaba", href: "https://oscafrica.org/" },
];

export const stack = [
  "TypeScript",
  "Node.js",
  "Python",
  "Solidity and Foundry",
  "Compact and zero-knowledge circuits",
  "MCP servers and agent tooling",
  "Docs-as-code and llms.txt",
  "PostgreSQL",
  "Kafka",
  "Docker",
];
