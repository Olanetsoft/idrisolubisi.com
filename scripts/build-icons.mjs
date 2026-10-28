// Builds public/icons.svg, one SVG sprite with every logo and icon the site
// uses, from src/components/icon-data.json. Pages reference icons with
// <use href="/icons.svg#id">, so each shape is downloaded once and cached
// instead of being repeated in every page's HTML. Run with: npm run icons
import { readFile, writeFile } from "node:fs/promises";

const data = JSON.parse(
  await readFile(new URL("../src/components/icon-data.json", import.meta.url), "utf8"),
);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

let symbols = "";
for (const [name, brand] of Object.entries(data.brands)) {
  symbols += `<symbol id="b-${name}" viewBox="0 0 24 24"><path d="${esc(brand.path)}"/></symbol>`;
}
for (const [name, paths] of Object.entries(data.ui ?? {})) {
  const body = paths
    .map((p) => `<path d="${esc(p.d)}"${p.tone ? ' opacity="0.22"' : ""}/>`)
    .join("");
  symbols += `<symbol id="u-${name}" viewBox="0 0 256 256">${body}</symbol>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols}</defs></svg>\n`;
await writeFile(new URL("../public/icons.svg", import.meta.url), svg);
console.log(
  `build-icons: ${Object.keys(data.brands).length + Object.keys(data.ui ?? {}).length} icons, ${svg.length} bytes`,
);
