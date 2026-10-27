export type Role = {
  company: string;
  title: string;
  /** En dash, no spaces, so the period never wraps. */
  period: string;
  location?: string;
  /** What was done in the role, as short points on the card. ==text== marks a figure or key fact to bold. */
  highlights: string[];
  /** The same work as checked points, for /llms.txt. From the CV, the brief and the owner. */
  points: string[];
  url?: string;
  /** What the company does, in one line, for /llms-full.txt. */
  about?: string;
};

export const experience: Role[] = [
  {
    company: "Midnight Foundation",
    title: "Developer Educator, Developer Relations",
    highlights: [
      "Built the Midnight MCP server (==10,000+ downloads==, ==11,900+ agent tool calls==).",
      "Led the docs overhaul for AI retrieval, including the docs AI assistant, and used the 784 questions it received to plan new content.",
      "Launched Midnight Academy (==1,576 enrolled, 1,120+ certified==) and a 12-part video series.",
      "Built create-mn-app, Compact Playground and Compact by Example, and kept example repos current with CI and on-call.",
      "Ran partner integrations, workshops and two content-bounty cohorts.",
    ],
    points: [
      "Built the Midnight MCP server so AI coding assistants wrote correct code: 10,000+ downloads, 11,900+ agent tool calls.",
      "Led the docs overhaul for AI retrieval (server-side rendering and an llms.txt index), including the docs AI assistant, and used its 784 questions to plan new docs and videos.",
      "Launched Midnight Academy, a three-tier zero-knowledge and Compact curriculum (Foundations, Intermediate, Advanced) with 1,576 enrolled and 1,120+ certified, plus Compact by Example, a browser playground for compiling contracts and a 12-part video series.",
      "Ran partner integrations and workshops, taught a University of Zurich session, and ran two bounty cohorts, the second publishing 20 tutorials, with every submission gated on code that compiles.",
    ],
    period: "Sep 2025–Sep 2026",
    location: "Remote",
    url: "https://midnight.network/",
    about: "Midnight is a data-protection blockchain for confidential smart contracts.",
  },
  {
    company: "Axelar / Interop Labs",
    title: "Developer Relations Engineer",
    highlights: [
      "==First developer-relations engineer on the team==, under the Head of Developer Relations.",
      "Embedded with partner engineering teams as solution architect, from discovery to production launch.",
      "Built a Foundry reference implementation that cut cross-chain integration setup time ==55%== (==500+ weekly developer activations==).",
      "Supported ==100,000+ developers== through debugging, talks and workshops at ==4.8/5 satisfaction==.",
      "Tracked the onboarding funnel to remove adoption blockers, and grew docs usage ==120%==.",
    ],
    points: [
      "First developer-relations engineer on the team, under the Head of Developer Relations. Worked as solution architect inside partner engineering teams, from discovery to production launch.",
      "Built a reference implementation that cut cross-chain integration setup time 55%, with 500+ weekly developer activations.",
      "Supported 100,000+ developers and builders through hands-on debugging, talks and workshops, rated 4.8/5.",
      "Grew documentation usage 120% with rewritten docs and interactive tutorials, and recorded live-coding and workshop videos.",
    ],
    period: "Apr 2023–Aug 2025",
    location: "Remote",
    url: "https://www.axelar.network/",
    about: "Axelar is a blockchain interoperability network for secure cross-chain communication.",
  },
  {
    company: "Mara",
    title: "Developer Relations Engineer",
    highlights: [
      "Cut developer onboarding time ==65%== by redesigning the docs-to-production path.",
      "Created Mara Academy’s technical courses, growing it to ==19,000+ active developers== at ==85% monthly retention==.",
      "Built the campus club from ==0 to 18+ universities== in Kenya and Nigeria, and reached ==30,000+ developers== through conferences, hackathons and workshops.",
      "Set up the feedback pipeline into product and managed strategic partners.",
    ],
    points: [
      "Cut developer onboarding time 65% by redesigning the docs-to-production path, and set up a feedback pipeline into product.",
      "Created Mara Academy’s technical courses, growing it to 19,000+ active developers at 85% monthly retention.",
      "Grew the campus club from 0 to 18+ universities, reached 30,000+ developers and builders across Africa, and managed strategic partners.",
    ],
    period: "Jul 2022–Apr 2023",
    location: "Nairobi",
  },
  {
    company: "Luna",
    title: "Backend Engineer",
    highlights: [
      "Built a multi-tenant payment service on Apache Kafka for ==50,000+ users==, integrating Stripe, PayPal and bank payments.",
      "Built the ==authentication and encryption layer==.",
      "Improved performance ==63%== through caching and a move to microservices, and held ==99.9% uptime== with monitoring and alerting.",
      "Mentored three junior engineers on system design.",
    ],
    points: [
      "Built a multi-tenant payment service on Apache Kafka for 50,000+ users across web and mobile, integrating Stripe, PayPal and bank payments.",
      "Improved application performance 63% through bottleneck analysis, caching and microservices, and held 99.9% uptime with monitoring and alerting.",
      "Built APIs for high-volume traffic and the authentication and encryption layer, and mentored three junior engineers on system design.",
    ],
    period: "Dec 2021–Jul 2022",
    location: "London, remote",
  },
  {
    company: "PhilanthroLab",
    title: "Backend Engineer (promoted to backend team lead)",
    highlights: [
      "Built most of the backend infrastructure and shipped the MVP.",
      "Then led technical programmes, system design, code reviews, documentation and architecture decisions.",
      "Designed an automated data lake processing ==100 GB+ a month==.",
      "Improved performance ==50%== with GraphQL, Node.js, Neo4j and Elasticsearch, and automated workflows saving ==1,000+ hours a year==.",
    ],
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
    highlights: [
      "Built .NET Core and SharePoint solutions for Access Bank, MTN Nigeria (part of MTN Group, Africa’s largest mobile operator) and NPDC (the exploration and production arm of NNPC, Nigeria’s national oil company).",
      "Automated processes for these clients, saving ==900+ hours a year==.",
      "Ran test-to-production deployments and database migrations with ==zero data loss==.",
      "Provided technical support and issue resolution, and wrote handover docs.",
    ],
    points: [
      "Built enterprise SharePoint and .NET Core (MVC 2.2 to 5.0) solutions for Access Bank and MTN Nigeria (part of MTN Group, Africa’s largest mobile operator).",
      "Automated business processes for these clients and NPDC (the exploration and production arm of NNPC, Nigeria’s national oil company), saving 900+ hours a year.",
      "Provided enterprise support, ran test-to-production deployments and database migrations with zero data loss, and wrote handover docs.",
    ],
    period: "Apr 2019–Jan 2021",
    location: "Lagos",
  },
];

export const education = {
  degree: "B.Eng. Electrical & Electronics Engineering",
  school: "Abubakar Tafawa Balewa University, Bauchi, Nigeria",
  year: "2018",
};

/** Communities and events outside his jobs: current ones first, then past. Figures are his confirmed numbers. */
export const community: {
  org: string;
  role: string;
  href: string;
  note?: string;
  current: boolean;
  /** Start date, for /llms-full.txt. */
  since?: string;
  /** A photo of him at their event, or a screenshot of their site, in public/images/community/ (1280x800). */
  image: string;
  /** The one line on the card. */
  summary: string;
  /** More context, for /llms-full.txt. */
  detail?: string;
}[] = [
  {
    org: "Web3 Afrika",
    role: "Founder",
    href: "https://web3afrika.com/",
    note: "15,000+ builders across Africa, backed by Developer DAO",
    current: true,
    since: "May 2022",
    detail: "Organises events and workshops, including the Build Afrika Summit",
    image: "/images/community/web3afrika-build-afrika.jpg",
    summary: "15,000+ builders across Africa",
  },
  {
    org: "Blockfest Africa",
    role: "Partnerships lead",
    href: "https://blockfestafrica.com/",
    note: "Leads the partnership team for the whole event; 12,000 participants in 2025",
    current: true,
    image: "/images/community/blockfest-stage.jpg",
    summary: "12,000 participants in 2025",
  },
  {
    org: "SheCodeAfrica",
    role: "Backend community lead",
    href: "https://shecodeafrica.org/",
    note: "Ran the backend programmes; SheCodeAfrica has 50,000+ members across 15 African countries",
    current: false,
    image: "/images/community/shecodeafrica.jpg",
    summary: "50,000+ members across 15 countries",
  },
  {
    org: "Open Source Community Africa",
    role: "Volunteer",
    href: "https://oscafrica.org/",
    note: "Received the OSCA Hero award",
    current: false,
    detail: "Yaba, Lagos: open source, technical writing and OSCAFEST organising",
    image: "/images/community/osca.jpg",
    summary: "Received the OSCA Hero award",
  },
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
