/**
 * Recommendations from people who worked or studied with him, taken from his
 * public LinkedIn recommendations, newest first. Each quote is whole
 * sentences, word for word: to shorten one, pick other sentences, never edit
 * a word. `relation` is LinkedIn's own wording; `date` is when it was
 * written, for /llms-full.txt only.
 */
export const testimonials: {
  name: string;
  href: string;
  relation: string;
  date: string;
  quote: string;
}[] = [
  {
    name: "Tobi Akinpelu",
    href: "https://www.linkedin.com/in/tobiakinpelu/",
    relation: "Studied with Idris",
    date: "2025-07",
    quote: "Idris speaks with quiet confidence. Their posts don’t shout, but they always land.",
  },
  {
    name: "Sylvester Amanyi",
    href: "https://www.linkedin.com/in/maisonarmani/",
    relation: "Managed Idris directly",
    date: "2023-01",
    quote:
      "Idris is an exceptional software engineer, with a strong aptitude for problem-solving and attention to detail. He is a critical thinker with a wealth of domain knowledge.",
  },
  {
    name: "Kolade Ige",
    href: "https://www.linkedin.com/in/koladeige/",
    relation: "Managed Idris directly",
    date: "2022-03",
    quote:
      "The few years I have worked with Idris has made me appreciate his skills and dedication as a Software Developer. He is also very open to seeking new knowledge as well as sharing. He is certainly an asset you want to keep on your team.",
  },
  {
    name: "Azeez Oyegoke",
    href: "https://www.linkedin.com/in/azeez-oyegoke-b9861a166/",
    relation: "Worked with Idris on the same team",
    date: "2021-03",
    quote:
      "Olubisi Idris Ayinde is a hands-on Software Developer, he has excellent analytical, communication and design skills. He loves to write clean and scalable code.",
  },
];
