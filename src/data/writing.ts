export type Article = {
  title: string;
  outlet: string;
  href: string;
  note?: string;
};

export const articles: Article[] = [
  {
    title: "Building full-stack applications with Supabase, React and Next.js",
    outlet: "freeCodeCamp",
    href: "https://www.freecodecamp.org/news/how-to-build-a-full-stack-application-with-tailwind-css-and-supabase-in-nextjs/",
  },
  {
    title: "Mainnet vs. testnet environments: a developer’s guide",
    outlet: "LogRocket",
    href: "https://blog.logrocket.com/mainnet-vs-testnet-environments-explained/",
  },
  {
    title: "Authentication API design with JWT tokens in Node.js",
    outlet: "Section",
    href: "https://www.cloudzilla.ai/dev-education/how-to-build-authentication-api-with-jwt-token-in-nodejs",
    note: "companion repo: 150+ stars",
  },
  {
    title: "Building cross-chain zapper dApps with React and real-time transactions",
    outlet: "Moralis",
    href: "https://moralis.io/how-to-build-a-cross-chain-zapper-dapp-with-reactjs-using-moralis-api-and-serverless-real-time-transactions/",
  },
  {
    title: "How to use cloud functions to automate GitHub moderation",
    outlet: "Dev.to",
    href: "https://dev.to/hackmamba/how-to-use-cloud-functions-to-automate-github-moderation-3g5p",
  },
  {
    title: "Building and pushing projects to Radicle, a decentralised Git protocol",
    outlet: "Hashnode",
    href: "https://web3.hashnode.com/how-to-build-and-push-projects-to-a-web3-decentralized-git-hosting-protocol-radicle",
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
