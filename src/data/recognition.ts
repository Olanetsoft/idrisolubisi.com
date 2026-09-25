export type Recognition = {
  title: string;
  by: string;
  /** ISO 8601 (year, year-month or full date); used in structured data, not shown on the page. */
  date: string;
  href?: string;
  /** press and sponsored become subjectOf articles in structured data; endorsement becomes an award. */
  kind: "press" | "sponsored" | "endorsement" | "badge";
  /** Set for sponsored or brand-press placements; surfaced as a disclosure. */
  note?: string;
};

/** Press, endorsements and community roles. Newest first. */
export const recognition: Recognition[] = [
  {
    title: "Meet Idris Olubisi, the Nigerian Web3 pioneer building Africa’s next generation of tech talent",
    by: "Business Insider Africa",
    date: "2026-01-11",
    href: "https://africa.businessinsider.com/local/lifestyle/meet-idris-olubisi-the-nigerian-web3-pioneer-building-africas-next-generation-of-tech/w89mmn5",
    kind: "press",
  },
  {
    title: "Idris Olubisi is championing Web3 inclusion in Africa beyond limits",
    by: "Technext",
    date: "2025-11-27",
    href: "https://technext24.com/2025/11/27/idris-olubisi-championing-web3-africa/",
    kind: "press",
  },
  {
    title: "The builder who teaches: inside the mind of the engineer shaping Africa’s Web3 future",
    by: "BusinessDay Weekender",
    date: "2025",
    href: "https://businessday.ng/bd-weekender/article/the-builder-who-teaches-inside-the-mind-of-the-engineer-shaping-africas-web3-future/",
    kind: "press",
  },
  {
    title: "Blockfest Africa 2025 draws 12,000 participants, strengthens Africa’s Web3 voice",
    by: "BusinessDay",
    date: "2025",
    href: "https://businessday.ng/news/article/blockfest-africa-2025-draws-12000-participants-strengthens-africas-web3-voice/",
    kind: "press",
  },
  {
    title: "The Build Afrika Summit rallies Africa’s top tech talent to build the future of decentralization",
    by: "Techpoint Africa",
    date: "2025-05-15",
    href: "https://techpoint.africa/brandpress/the-build-afrika-summit-rallies-africas-top-tech-talent-to-build-the-future-of-decentralization/",
    kind: "sponsored",
    note: "brand press",
  },
  {
    title: "UK Global Talent visa, endorsed for exceptional talent in digital technology",
    by: "Tech Nation / UK Home Office",
    date: "2024",
    kind: "endorsement",
  },
  {
    title: "Arctic Code Vault Contributor",
    by: "GitHub Archive Program",
    date: "2020",
    href: "https://github.com/Olanetsoft",
    kind: "badge",
  },
];
