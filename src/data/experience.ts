export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  highlights: string[];
  url?: string;
};

// NOTE: The Midnight role ended in 2026 — confirm the exact end month before publishing.
export const experience: Role[] = [
  {
    company: "Midnight",
    title: "Senior Developer Relations Engineer",
    period: "Sep 2025 — 2026",
    location: "Remote",
    url: "https://midnight.network/",
    highlights: [
      "Built and open-sourced the Midnight MCP server (10,000+ downloads, 11,900+ AI-agent tool calls) so AI assistants can build on a zero-knowledge blockchain.",
      "Re-architected documentation for LLM retrieval and launched Midnight Academy — 1,576 enrolled, 1,120+ certified.",
      "Owned developer activations end to end: hackathons, workshops and a content-bounty program tripled to 20 tutorials.",
    ],
  },
  {
    company: "Axelar / Interop Labs",
    title: "Developer Relations Engineer",
    period: "Apr 2023 — Aug 2025",
    location: "Remote",
    url: "https://www.axelar.network/",
    highlights: [
      "Built foundry-axelar-gmp-example, cutting cross-chain dApp setup time by 55% with 500+ developer adoptions.",
      "Engaged 100,000+ developers globally; increased documentation usage 120%; 4.8/5 developer satisfaction.",
      "Solution architect and integration support for strategic partners launching cross-chain applications.",
    ],
  },
  {
    company: "Mara",
    title: "Developer Relations Engineer",
    period: "Jul 2022 — Apr 2023",
    location: "Nairobi, Kenya",
    highlights: [
      "Reduced developer onboarding time by 65% with an optimised documentation-to-production workflow.",
      "Scaled Mara Developer Campus Club from 0 to 18+ universities; reached 30,000+ developers across Africa.",
      "Grew Mara Academy to 19,000+ active developers with 85% monthly retention.",
    ],
  },
  {
    company: "Luna",
    title: "Backend Engineer",
    period: "Dec 2021 — Jul 2022",
    location: "London, UK (remote)",
    highlights: [
      "Built a multi-tenant payment microservice on Apache Kafka serving 50,000+ users across web and mobile.",
      "Improved application performance by 63% and sustained 99.9% uptime with monitoring and alerting.",
      "Integrated Stripe, PayPal and bank-account payment flows; mentored three junior engineers.",
    ],
  },
  {
    company: "PhilanthroLab",
    title: "Backend Engineer",
    period: "Feb 2021 — Dec 2021",
    location: "Dallas, TX (remote)",
    highlights: [
      "Designed an automated data lake processing 100GB+ a month, saving 1,000+ hours of manual work annually.",
      "Improved application performance by 50% on a Node.js, GraphQL, Neo4j and Elasticsearch stack.",
    ],
  },
  {
    company: "Hotels.ng",
    title: "Backend Developer",
    period: "2020 — 2021",
    location: "Lagos, Nigeria",
    highlights: [
      "Led a team delivering a parser script generator, talent pool and customer payment application on Node.js, SQL, MongoDB, Redis and RabbitMQ.",
    ],
  },
  {
    company: "Tavia Technologies",
    title: "Software Developer / Support Analyst",
    period: "Apr 2019 — 2020",
    location: "Lagos, Nigeria",
    highlights: [
      "Automated business processes for MTN Nigeria, NPDC and Access Bank, saving 900+ hours a year.",
      "Delivered custom SharePoint and .NET Core solutions with zero data loss across deployments.",
    ],
  },
];

export const education = {
  degree: "B.Eng. Electrical & Electronics Engineering",
  school: "Abubakar Tafawa Balewa University, Bauchi, Nigeria",
  year: "2018",
};

export const community = [
  {
    org: "Web3 Afrika",
    role: "Founder",
    note: "15,000+ builders across Africa; Build Afrika Summit, Blockfest Africa, Monad Lagos hackathon.",
    href: "https://web3afrika.com/",
  },
  {
    org: "SheCodeAfrica",
    role: "Backend community lead",
    note: "50,000+ members learning to code across 15 African countries.",
    href: "https://shecodeafrica.org/",
  },
  {
    org: "Open Source Community Africa",
    role: "OSCA Hero, Yaba",
    note: "Open source, technical writing and OSCAFEST organising.",
    href: "https://oscafrica.org/",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "AI & agent tooling",
    items: [
      "MCP servers",
      "Claude API",
      "OpenAI APIs",
      "LangChain",
      "RAG",
      "AI agents",
      "Ollama / local inference",
      "LLM-readable docs (llms.txt)",
    ],
  },
  {
    group: "Web3",
    items: ["Solidity", "Rust", "Compact (ZK)", "Foundry", "Ethers.js", "EVM & Base", "Cross-chain (GMP)"],
  },
  {
    group: "Engineering",
    items: [
      "TypeScript",
      "Node.js",
      "Python",
      "React & Next.js",
      "PostgreSQL",
      "Kafka",
      "GraphQL",
      "Docker",
      "GCP & Azure",
    ],
  },
  {
    group: "Developer relations",
    items: [
      "Documentation architecture",
      "Developer education",
      "Activation funnels",
      "Partner engineering",
      "Community operations",
      "Public speaking",
    ],
  },
];
