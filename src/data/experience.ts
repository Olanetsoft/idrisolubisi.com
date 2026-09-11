export type Role = {
  company: string;
  title: string;
  /** En dash, no spaces, so the period never wraps in the table. */
  period: string;
  highlights: string[];
  url?: string;
};

export const careerIntro =
  "Backend engineer first: a multi-tenant payments service on Kafka at Luna, a data lake at PhilanthroLab, Node.js at Hotels.ng in Lagos. Then developer relations at Mara in Nairobi, at Axelar, and at Midnight. The engineering came first; it is why the advocacy holds up on a hard partner call.";

// NOTE: confirm the exact end month of the Midnight role before publishing.
export const experience: Role[] = [
  {
    company: "Midnight",
    title: "Senior Developer Relations Engineer",
    period: "Sep 2025–2026",
    url: "https://midnight.network/",
    highlights: [
      "Built and open-sourced the Midnight MCP server (10,000+ downloads, 11,900+ AI-agent tool calls) so AI assistants can build on a zero-knowledge blockchain.",
      "Re-architected documentation for LLM retrieval and launched Midnight Academy: 1,576 enrolled, 1,120+ certified.",
      "Owned developer activations end to end: hackathons, workshops and a content-bounty programme tripled to 20 tutorials.",
    ],
  },
  {
    company: "Axelar / Interop Labs",
    title: "Developer Relations Engineer",
    period: "Apr 2023–Aug 2025",
    url: "https://www.axelar.network/",
    highlights: [
      "Wrote foundry-axelar-gmp-example, cutting cross-chain dApp setup time by 55% with 500+ developer adoptions.",
      "Engaged 100,000+ developers; increased documentation usage 120%; 4.8/5 developer satisfaction.",
      "Solution architect and integration support for strategic partners launching cross-chain applications.",
    ],
  },
  {
    company: "Mara",
    title: "Developer Relations Engineer",
    period: "Jul 2022–Apr 2023",
    highlights: [
      "Reduced developer onboarding time by 65% with an optimised documentation-to-production workflow.",
      "Scaled Mara Developer Campus Club from 0 to 18+ universities; reached 30,000+ developers across Africa.",
      "Grew Mara Academy to 19,000+ active developers with 85% monthly retention.",
    ],
  },
  {
    company: "Luna",
    title: "Backend Engineer",
    period: "Dec 2021–Jul 2022",
    highlights: [
      "Built a multi-tenant payment microservice on Apache Kafka serving 50,000+ users across web and mobile.",
      "Improved application performance by 63% and sustained 99.9% uptime with monitoring and alerting.",
      "Integrated Stripe, PayPal and bank-account payment flows; mentored three junior engineers.",
    ],
  },
  {
    company: "PhilanthroLab",
    title: "Backend Engineer",
    period: "Feb 2021–Dec 2021",
    highlights: [
      "Designed an automated data lake processing 100GB+ a month, saving 1,000+ hours of manual work a year.",
      "Improved application performance by 50% on a Node.js, GraphQL, Neo4j and Elasticsearch stack.",
    ],
  },
  {
    company: "Hotels.ng",
    title: "Backend Developer",
    period: "2020–2021",
    highlights: [
      "Led a team delivering a parser script generator, talent pool and customer payment application on Node.js, SQL, MongoDB, Redis and RabbitMQ.",
    ],
  },
  {
    company: "Tavia Technologies",
    title: "Software Developer / Support Analyst",
    period: "Apr 2019–2020",
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
  "MCP servers",
  "LLM-readable docs",
  "Compact and zero-knowledge circuits",
  "Solidity and Foundry",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Kafka",
];
