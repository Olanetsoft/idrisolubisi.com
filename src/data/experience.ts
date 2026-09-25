export type Role = {
  company: string;
  title: string;
  /** En dash, no spaces, so the period never wraps. */
  period: string;
  location?: string;
  /** The one line shown on the site. */
  scope: string;
  /** Detail for the CV and /llms.txt; not rendered on the page. */
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
      "Developer relations for a zero-knowledge blockchain: the MCP server, LLM-readable docs, Midnight Academy and partner onboarding.",
    highlights: [
      "Built and open-sourced the Midnight MCP server: 30 tools, 10,000+ npm downloads, 11,900+ tool calls served to AI coding agents.",
      "Re-architected the documentation for LLM retrieval (server-side rendering, llms.txt index).",
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
      "Grew the cross-chain developer community and was the technical point of contact for partners integrating Axelar.",
    highlights: [
      "Wrote foundry-axelar-gmp-example, the reference implementation for cross-chain messaging: setup time −55%, adopted by 500+ developers.",
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
    scope: "First developer-relations hire; built the developer programme from zero across 18+ universities.",
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
    scope: "Payments microservice on Apache Kafka serving 50,000+ users; Stripe, PayPal and bank integrations.",
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
    scope: "Automated data lake and Node.js, GraphQL and Neo4j services.",
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
    scope: "Led a small team on payments and internal tooling in Node.js.",
    highlights: [
      "Led a team delivering a parser script generator, a talent pool and a customer payments application on Node.js, SQL, MongoDB, Redis and RabbitMQ.",
    ],
  },
  {
    company: "Tavia Technologies",
    title: "Software Developer / Support Analyst",
    period: "Apr 2019–2020",
    location: "Lagos",
    scope: "SharePoint and .NET solutions for MTN Nigeria, NPDC and Access Bank.",
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
  {
    label: "Languages and frameworks",
    items: ["TypeScript", "JavaScript", "Node.js", "React", "Next.js", "Vue.js", "Express"],
  },
  {
    label: "Web3",
    items: ["Solidity", "Rust", "Foundry", "Ethers.js", "Compact and zero-knowledge circuits", "cross-chain messaging"],
  },
  {
    label: "AI",
    items: ["MCP servers", "Claude and OpenAI APIs", "LangChain", "RAG", "prompt engineering", "n8n"],
  },
  {
    label: "Data and infrastructure",
    items: ["PostgreSQL", "MongoDB", "GraphQL", "Redis", "RabbitMQ", "Kafka", "Elasticsearch", "Docker", "GCP", "Azure", "Linux"],
  },
  {
    label: "Developer relations",
    items: ["Docusaurus", "docs-as-code", "llms.txt", "Postman", "Discord and Slack community management", "Google Analytics"],
  },
];
