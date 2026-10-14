export type Article = {
  title: string;
  outlet: string;
  href: string;
  /** Month first published, as YYYY-MM, taken from the publisher's page. Shown as "Jan 2022". */
  date: string;
  note?: string;
};

/** Newest first. */
export const articles: Article[] = [
  {
    title: "Midnight MCP: AI-assisted development for Compact smart contracts",
    outlet: "Dev.to",
    href: "https://dev.to/devsofmidnight/midnight-mcp-ai-assisted-development-for-compact-smart-contracts-37i",
    date: "2026-02",
  },
  {
    title: "Fixing the spawn ENOENT error when connecting MCP servers to Claude Desktop",
    outlet: "freeCodeCamp",
    href: "https://www.freecodecamp.org/news/how-to-fix-the-python-enoent-error-when-setting-up-mcp-servers-a-complete-guide/",
    date: "2025-08",
  },
  {
    title: "How to use cloud functions to automate GitHub moderation",
    outlet: "Dev.to",
    href: "https://dev.to/hackmamba/how-to-use-cloud-functions-to-automate-github-moderation-3g5p",
    date: "2023-12",
  },
  {
    title: "Mainnet vs. testnet environments: a developer’s guide",
    outlet: "LogRocket",
    href: "https://blog.logrocket.com/mainnet-vs-testnet-environments-explained/",
    date: "2022-05",
  },
  {
    title: "Building cross-chain zapper dApps with React and real-time transactions",
    outlet: "Moralis",
    href: "https://moralis.com/how-to-build-a-cross-chain-zapper-dapp-with-reactjs-using-moralis-api-and-serverless-real-time-transactions/",
    date: "2022-03",
  },
  {
    title: "Building full-stack applications with Supabase, React and Next.js",
    outlet: "freeCodeCamp",
    href: "https://www.freecodecamp.org/news/how-to-build-a-full-stack-application-with-tailwind-css-and-supabase-in-nextjs/",
    date: "2022-01",
  },
  {
    title: "Authentication API design with JWT tokens in Node.js",
    outlet: "Section",
    href: "https://github.com/section-engineering-education/engineering-education/blob/master/content/articles/how-to-build-authentication-api-with-jwt-token-in-nodejs/index.md",
    date: "2021-06",
    note: "companion repo: 150+ stars",
  },
];

export const platforms = [
  "freeCodeCamp",
  "LogRocket",
  "Dev.to",
  "Moralis",
  "Section",
  "Alchemy",
  "Infura",
  "Appsmith",
  "Hashnode",
];

export const writingStats = {
  tutorials: "40+",
  reads: "10M+",
};
