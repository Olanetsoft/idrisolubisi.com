export type Role = {
  company: string;
  title: string;
  /** En dash, no spaces, so the period never wraps. */
  period: string;
  location?: string;
  /** Two to four checked points on what was done, with numbers. Used by /llms.txt; the page shows company, title and dates only. From the CV, the brief and the owner. */
  points: string[];
  url?: string;
};

export const experience: Role[] = [
  {
    company: "Midnight Foundation",
    title: "Developer Educator, Developer Relations",
    points: [
      "Built the Midnight MCP server so AI coding assistants wrote correct code: 10,000+ downloads, 11,900+ agent tool calls.",
      "Led the docs overhaul for AI retrieval, ran the docs AI assistant and used 784 of its questions to plan new content.",
      "Launched Midnight Academy (1,576 enrolled, 1,120+ certified), Compact by Example, a browser playground for compiling contracts and a 12-part video series.",
      "Ran partner integrations and workshops, taught a University of Zurich session, and ran two bounty cohorts, the second publishing 20 tutorials.",
    ],
    period: "Sep 2025–Sep 2026",
    location: "Remote",
    url: "https://midnight.network/",
  },
  {
    company: "Axelar / Interop Labs",
    title: "Developer Relations Engineer",
    points: [
      "First developer-relations engineer on the team, under the Head of Developer Relations. Worked as solution architect inside partner engineering teams, from discovery to production launch.",
      "Built a reference implementation that cut cross-chain integration setup time 55%, with 500+ weekly adoptions.",
      "Supported 100,000+ developers and builders through hands-on debugging, talks and workshops, rated 4.8/5.",
      "Grew documentation usage 120% with rewritten docs and interactive tutorials, and recorded live-coding and workshop videos.",
    ],
    period: "Apr 2023–Aug 2025",
    location: "Remote",
    url: "https://www.axelar.network/",
  },
  {
    company: "Mara",
    title: "Developer Relations Engineer",
    points: [
      "Cut developer onboarding time 65% by redesigning the docs-to-production path, and set up a feedback pipeline into product.",
      "Created Mara Academy's technical courses, growing it to 19,000+ active developers at 85% monthly retention.",
      "Grew the campus club from 0 to 18+ universities, reached 30,000+ developers and builders across Africa, and managed strategic partners.",
    ],
    period: "Jul 2022–Apr 2023",
    location: "Nairobi",
  },
  {
    company: "Luna",
    title: "Backend Engineer",
    points: [
      "Built a multi-tenant payment service on Apache Kafka for 50,000+ users, integrating Stripe, PayPal and bank payments.",
      "Improved application performance 63% through bottleneck analysis, caching and microservices, and held 99.9% uptime with monitoring and alerting.",
      "Built APIs for high-volume traffic and the authentication and encryption layer, and mentored three junior engineers on system design.",
    ],
    period: "Dec 2021–Jul 2022",
    location: "London, remote",
  },
  {
    company: "PhilanthroLab",
    title: "Backend Engineer (promoted to backend team lead)",
    points: [
      "Built most of the backend infrastructure, shipped the MVP, and improved performance 50% with GraphQL, Node.js, Neo4j and Elasticsearch.",
      "Promoted to backend team lead, then led technical programmes, system design, code reviews, documentation and architecture decisions.",
      "Designed an automated data lake processing 100 GB+ a month, and automated workflows saving 1,000+ hours a year.",
    ],
    period: "Feb 2021–Dec 2021",
    location: "Dallas, remote",
  },
  {
    company: "Tavia Technologies",
    title: "Software Developer / Support Analyst",
    points: [
      "Built enterprise SharePoint and .NET Core solutions for Access Bank (a leading bank in Africa) and MTN Nigeria (part of MTN Group, Africa's largest telecom company).",
      "Automated business processes for these clients and NPDC (the exploration and production arm of NNPC, Nigeria's national oil company), saving 900+ hours a year.",
      "Provided enterprise support, ran test-to-production deployments and database migrations with zero data loss, and wrote handover docs.",
    ],
    period: "Apr 2019–Jan 2021",
    location: "Lagos",
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
