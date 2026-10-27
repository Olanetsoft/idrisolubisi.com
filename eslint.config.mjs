import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    // .claude holds local agent skills and .taste-skill their reports; neither ships.
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "next-env.d.ts",
      ".claude/**",
      ".taste-skill/**",
    ],
  },
];

export default config;
