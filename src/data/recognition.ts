export type Recognition = {
  title: string;
  by: string;
  date: string;
  href?: string;
  /** Set for sponsored or brand-press placements; surfaced as a disclosure. */
  note?: string;
};

/** Press, endorsements and community roles. Newest first. */
export const recognition: Recognition[] = [
  {
    title: "Meet Idris Olubisi, the Nigerian Web3 pioneer building Africa’s next generation of tech talent",
    by: "Business Insider Africa",
    date: "January 2026",
    href: "https://africa.businessinsider.com/local/lifestyle/meet-idris-olubisi-the-nigerian-web3-pioneer-building-africas-next-generation-of-tech/w89mmn5",
  },
  {
    title: "Idris Olubisi is championing Web3 inclusion in Africa beyond limits",
    by: "Technext",
    date: "November 2025",
    href: "https://technext24.com/2025/11/27/idris-olubisi-championing-web3-africa/",
  },
  {
    title: "The builder who teaches: inside the mind of the engineer shaping Africa’s Web3 future",
    by: "BusinessDay Weekender",
    date: "2025",
    href: "https://businessday.ng/bd-weekender/article/the-builder-who-teaches-inside-the-mind-of-the-engineer-shaping-africas-web3-future/",
  },
  {
    title: "Blockfest Africa 2025 draws 12,000 participants, strengthens Africa’s Web3 voice",
    by: "BusinessDay",
    date: "2025",
    href: "https://businessday.ng/news/article/blockfest-africa-2025-draws-12000-participants-strengthens-africas-web3-voice/",
  },
  {
    title: "The Build Afrika Summit rallies Africa’s top tech talent to build the future of decentralization",
    by: "Techpoint Africa",
    date: "May 2025",
    href: "https://techpoint.africa/brandpress/the-build-afrika-summit-rallies-africas-top-tech-talent-to-build-the-future-of-decentralization/",
    note: "brand press",
  },
  {
    title: "UK Global Talent visa, endorsed for exceptional talent in digital technology",
    by: "Tech Nation / UK Home Office",
    date: "2024",
  },
  {
    title: "Arctic Code Vault Contributor",
    by: "GitHub Archive Program",
    date: "2020",
    href: "https://github.com/Olanetsoft",
  },
];
