export type Article = {
  title: string;
  outlet: string;
  href: string;
  note?: string;
};

export type Press = {
  outlet: string;
  headline: string;
  date: string;
  href: string;
  /** False for sponsored or brand-press placements; surfaced as a disclosure. */
  independent: boolean;
  /** Set on the entries shown as typed clippings on the home page. */
  clip?: boolean;
  /** A first-person line shown under the clipping. */
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

export const press: Press[] = [
  {
    outlet: "BusinessDay Weekender",
    headline: "The builder who teaches: inside the mind of the engineer shaping Africa’s Web3 future",
    date: "2025",
    href: "https://businessday.ng/bd-weekender/article/the-builder-who-teaches-inside-the-mind-of-the-engineer-shaping-africas-web3-future/",
    independent: true,
    clip: true,
    note: "Their headline, not mine. It is the shortest accurate description of the job.",
  },
  {
    outlet: "Business Insider Africa",
    headline: "Meet Idris Olubisi, the Nigerian Web3 pioneer building Africa’s next generation of tech talent",
    date: "January 2026",
    href: "https://africa.businessinsider.com/local/lifestyle/meet-idris-olubisi-the-nigerian-web3-pioneer-building-africas-next-generation-of-tech/w89mmn5",
    independent: true,
    clip: true,
  },
  {
    outlet: "Technext",
    headline: "Idris Olubisi is championing Web3 inclusion in Africa beyond limits",
    date: "November 2025",
    href: "https://technext24.com/2025/11/27/idris-olubisi-championing-web3-africa/",
    independent: true,
  },
  {
    outlet: "BusinessDay",
    headline: "Blockfest Africa 2025 draws 12,000 participants, strengthens Africa’s Web3 voice",
    date: "2025",
    href: "https://businessday.ng/news/article/blockfest-africa-2025-draws-12000-participants-strengthens-africas-web3-voice/",
    independent: true,
  },
  {
    outlet: "Techpoint Africa",
    headline: "The Build Afrika Summit rallies Africa’s top tech talent to build the future of decentralization",
    date: "May 2025",
    href: "https://techpoint.africa/brandpress/the-build-afrika-summit-rallies-africas-top-tech-talent-to-build-the-future-of-decentralization/",
    independent: false,
  },
];

export const writingProvenance = {
  items: ["10,000,000+ views across platforms", "100,000+ a month on freeCodeCamp", "40+ tutorials, 200,000+ readers a year on the blog"],
  source: "freeCodeCamp author page",
  href: "https://www.freecodecamp.org/news/author/idris/",
  asOf: "2026-09-11",
};
