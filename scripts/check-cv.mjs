// Refuses to ship a placeholder CV to production. Fails on a Netlify production
// build (or generic CI); warns on deploy previews and locally.
import { readFileSync, statSync } from "node:fs";

const file = new URL("../public/Idris-Olubisi-CV-2026.pdf", import.meta.url);
const strict = process.env.CONTEXT ? process.env.CONTEXT === "production" : Boolean(process.env.CI);

let problem = "";
try {
  const size = statSync(file).size;
  const head = readFileSync(file).toString("latin1");
  if (size < 20_000) problem = `CV is ${size} bytes; expected a real PDF (> 20 KB)`;
  else if (/Placeholder/i.test(head)) problem = "CV still contains the word 'Placeholder'";
} catch {
  problem = "public/Idris-Olubisi-CV-2026.pdf is missing";
}

if (problem) {
  const msg = `check-cv: ${problem}`;
  if (strict) {
    console.error(msg);
    process.exit(1);
  }
  console.warn(`${msg} (warning only outside a production build)`);
}
