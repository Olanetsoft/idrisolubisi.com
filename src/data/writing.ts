export type Article = {
  title: string;
  outlet: string;
  href: string;
  /** Month first published, as YYYY-MM, taken from the publisher's page. Shown as "Jan 2022". */
  date: string;
  note?: string;
};

/** Newest first. Posts from his own blog have outlet "Blog". */
export const articles: Article[] = [
  {
    title: "Why Africa’s Web3 future must be built on Web2 fundamentals",
    outlet: "TechCabal",
    href: "https://techcabal.com/2026/03/26/africas-web3-will-be-built-on-web2/",
    date: "2026-03",
  },
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
    title: "Building your first token: a Solidity speedrun",
    outlet: "Blog",
    href: "https://blog.idrisolubisi.com/building-your-first-token-a-solidity-speedrun",
    date: "2025-08",
  },
  {
    title: "How to set up cross-chain messaging between EVM and Cosmos",
    outlet: "Blog",
    href: "https://blog.idrisolubisi.com/how-to-set-up-cross-chain-messaging-between-evm-and-cosmos",
    date: "2024-11",
  },
  {
    title: "How Merkle proofs work",
    outlet: "Blog",
    href: "https://blog.idrisolubisi.com/how-merkle-proofs-work",
    date: "2024-05",
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

/**
 * Where his tutorials ran. Most have an article in the list above; the ones
 * that don't link to one: Appsmith to the article it published, Infura to
 * his tutorial on its NFT SDK (his own blog, the owner's call). Alchemy's
 * only byline page no longer shows the article, so it stays a name.
 */
export const platforms: { name: string; href?: string }[] = [
  { name: "freeCodeCamp" },
  { name: "TechCabal" },
  { name: "LogRocket" },
  { name: "Dev.to" },
  { name: "Medium" },
  { name: "Moralis" },
  { name: "Section" },
  { name: "Alchemy" },
  {
    name: "Infura",
    href: "https://blog.idrisolubisi.com/easily-create-an-nft-app-using-the-new-infura-nft-sdk-typescript",
  },
  {
    name: "Appsmith",
    href: "https://www.appsmith.com/blog/upload-and-manage-files-on-cloudinary-with-the-filepicker-widget",
  },
  { name: "Hashnode" },
];

export const writingStats = {
  reads: "10M+",
};

/**
 * The curated list plus any blog post newer than its newest entry, so new
 * posts appear on the next build without editing this file.
 */
export function writingList(posts: { title: string; url: string; date: string }[]): Article[] {
  const newest = articles.reduce((max, a) => (a.date > max ? a.date : max), "");
  const fresh = posts
    .filter((p) => p.date > newest)
    .map((p) => ({ title: p.title, outlet: "Blog", href: p.url, date: p.date }));
  return [...fresh, ...articles];
}
