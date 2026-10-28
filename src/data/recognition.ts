export type Recognition = {
  title: string;
  by: string;
  /** ISO 8601 (year, year-month or full date); used in structured data, not shown on the page. */
  date: string;
  href?: string;
  /** press, sponsored and interview become subjectOf items in structured data; endorsement and award become awards. */
  kind: "press" | "sponsored" | "interview" | "endorsement" | "award";
  /** Set for sponsored or brand-press placements; surfaced as a disclosure. */
  note?: string;
  /** More context for /llms.txt and /llms-full.txt; not shown on the page. */
  detail?: string;
};

/** Independent press, honours and interviews, strongest first. The page shows no dates. */
export const recognition: Recognition[] = [
  {
    title:
      "Meet Idris Olubisi, the Nigerian Web3 pioneer building Africa’s next generation of tech talent",
    by: "Business Insider Africa",
    date: "2026-01-11",
    href: "https://africa.businessinsider.com/local/lifestyle/meet-idris-olubisi-the-nigerian-web3-pioneer-building-africas-next-generation-of-tech/w89mmn5",
    kind: "press",
  },
  {
    title: "The builder who teaches: inside the mind of the engineer shaping Africa’s Web3 future",
    by: "BusinessDay Weekender",
    date: "2025-11-29",
    href: "https://businessday.ng/bd-weekender/article/the-builder-who-teaches-inside-the-mind-of-the-engineer-shaping-africas-web3-future/",
    kind: "press",
  },
  {
    title: "Idris Olubisi is championing Web3 inclusion in Africa beyond limits",
    by: "Technext",
    date: "2025-11-27",
    href: "https://technext24.com/founders-spotlight/idris-olubisi-championing-web3-africa/",
    kind: "press",
  },
  {
    title: "UK Global Talent visa, endorsed for exceptional talent in digital technology",
    by: "Tech Nation / UK Home Office",
    date: "2024",
    kind: "endorsement",
  },
  {
    title: "Named a Top Contributor four times",
    by: "freeCodeCamp",
    date: "2025-11-25",
    href: "https://www.freecodecamp.org/news/freecodecamp-top-open-source-contributors-2025/",
    kind: "award",
    detail: "On freeCodeCamp’s top contributor lists for 2021, 2022, 2023 and 2025",
  },
  {
    title: "Interview: Web3 Afrika, empowering African Web3 builders",
    by: "Developer DAO / DevNTell",
    date: "2024-11-08",
    href: "https://www.youtube.com/watch?v=CS9BSzfiMLo",
    kind: "interview",
  },
  {
    title: "Podcast: building communities and cross-chain dapps",
    by: "Building Onchain",
    date: "2024-06-24",
    href: "https://creators.spotify.com/pod/show/paloma0842/episodes/Building-communities-and-cross-chain-dapps-wIdris-Olubisi-e2l7oq5",
    kind: "interview",
  },
  {
    title: "Idris Olubisi’s journey from coding on a phone to building developer communities",
    by: "The Geek Circle",
    date: "2026-02-12",
    href: "https://thegeekcircle.com/idris-olubisi/",
    kind: "press",
  },
  {
    title:
      "“Web3 does not replace existing technologies but increases the range of solutions”: key takeaways from the Web3 Lagos Conference",
    by: "Technext",
    date: "2022-10-11",
    href: "https://technext24.com/crypto/key-takes-from-web3-lagos-conference/",
    kind: "press",
  },
];
