// The yellow marker is capped at five uses on the home page and never sits in a heading.
// Runs after `next build` against the prerendered HTML.
import { readFileSync } from "node:fs";

const file = new URL("../.next/server/app/index.html", import.meta.url);
let html;
try {
  html = readFileSync(file, "utf8");
} catch {
  console.warn("check-markers: no prerendered index.html found, skipping");
  process.exit(0);
}

const markers = (html.match(/<mark class="marker"/g) ?? []).length;
const inHeading = /<h[1-3][^>]*>(?:(?!<\/h[1-3]>).)*<mark class="marker"/s.test(html);

if (markers > 5) {
  console.error(`check-markers: ${markers} marker highlights on the home page; the cap is 5`);
  process.exit(1);
}
if (inHeading) {
  console.error("check-markers: a marker highlight sits inside a heading");
  process.exit(1);
}
console.log(`check-markers: ${markers} of 5 markers used`);
