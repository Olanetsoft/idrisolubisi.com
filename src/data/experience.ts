export type Role = {
  company: string;
  title: string;
  /** En dash, no spaces, so the period never wraps. */
  period: string;
  location?: string;
  /** Summary for /llms.txt; not rendered on the page. */
  scope: string;
  /** Detail for the CV and /llms.txt; not rendered on the page. */
  highlights: string[];
  url?: string;
};

export const experience: Role[] = [
  {
    company: "Midnight Foundation",
    title: "Developer Educator, Developer Relations",
    period: "Sep 2025–Sep 2026",
    location: "Remote",
    url: "https://midnight.network/",
    scope:
      "Developer relations for a zero-knowledge blockchain: the MCP server, docs that AI tools can read, Midnight Academy and partner onboarding.",
    highlights: [
      "Built and open-sourced the Midnight MCP server: 10,000+ npm downloads, 11,900+ tool calls served to AI coding agents.",
      "Rebuilt the documentation so AI tools can read it (server-side rendering, llms.txt index).",
      "Developed the curriculum for Midnight Academy, three tiers of Compact and zero-knowledge content: 1,576 enrolled, 1,120+ certified.",
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
      "First developer-relations hire; grew the cross-chain developer community and was the technical point of contact for partners integrating Axelar.",
    highlights: [
      "Wrote foundry-axelar-gmp-example, the reference implementation for cross-chain messaging: setup time −55%, adopted by 500+ developers.",
      "Rewrote the documentation with interactive tutorials and troubleshooting guides; documentation usage +120%.",
      "Supported 100,000+ developers with hands-on integration debugging, rated 4.8/5.",
      "Acted as solution architect for strategic partners: validated technical blueprints and gave go-to-market and integration support through launch.",
    ],
  },
  {
    company: "Mara",
    title: "Developer Relations Engineer",
    period: "Jul 2022–Apr 2023",
    location: "Nairobi",
    scope: "Built the developer programme from zero across 18+ universities.",
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
    scope:
      "Payments microservice on Apache Kafka serving 50,000+ users; Stripe, PayPal and bank integrations.",
    highlights: [
      "Built a multi-tenant payments microservice on Apache Kafka serving 50,000+ users across web and mobile.",
      "Improved application performance by 63% and held 99.9% uptime under high-volume traffic with monitoring and alerting.",
      "Integrated Stripe, PayPal and bank-account payment flows; mentored three junior engineers.",
    ],
  },
  {
    company: "PhilanthroLab",
    title: "Backend Engineer (promoted to backend team lead)",
    period: "Feb 2021–Dec 2021",
    location: "Dallas, remote",
    scope: "Automated data lake and Node.js, GraphQL and Neo4j services.",
    highlights: [
      "Designed an automated data lake processing 100 GB+ a month, saving 1,000+ hours of manual retrieval a year.",
      "Improved application performance by 50% on a Node.js, GraphQL, Neo4j and Elasticsearch stack.",
    ],
  },
  {
    company: "Tavia Technologies",
    title: "Software Developer / Support Analyst",
    period: "Apr 2019–Jan 2021",
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
    label: "Agent harness",
    items: [
      "tool use and MCP servers",
      "context management",
      "orchestration",
      "verification gates",
      "human-in-the-loop approval",
      "safety layers independent of the agent",
      "agent session observability",
      "Claude and OpenAI APIs",
      "Claude Code, Cursor and Codex",
      "local inference with Ollama, GGUF models and RAG",
    ],
  },
  {
    label: "Backend",
    items: [
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Apache Kafka",
      "RabbitMQ",
      "event-driven and microservice architectures",
      "REST and GraphQL",
      "WebSockets",
      "Neo4j",
      "Elasticsearch",
      ".NET Core and SharePoint (earlier)",
    ],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Vue", "Vite", "Vitest"],
  },
  {
    label: "Correctness and reliability",
    items: [
      "atomic transactions",
      "optimistic locking",
      "idempotency keys",
      "rate limiting",
      "monitoring and alerting",
      "performance profiling",
      "zero-data-loss migrations",
    ],
  },
  {
    label: "Delivery",
    items: [
      "GitHub Actions CI",
      "Docker",
      "Cloudflare Workers and Vectorize",
      "Vercel",
      "Supabase",
      "release runbooks",
      "on-call rotations",
    ],
  },
  {
    label: "Web3",
    items: ["Solidity", "Foundry", "Compact and zero-knowledge circuits", "cross-chain messaging"],
  },
];
