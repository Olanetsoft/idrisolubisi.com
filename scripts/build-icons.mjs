// Builds public/icons.svg, one SVG sprite with every brand mark the site uses
// (the profile links in Contact), from src/components/icon-data.json. Pages reference icons with
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
const svg = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols}</defs></svg>\n`;
await writeFile(new URL("../public/icons.svg", import.meta.url), svg);
console.log(`build-icons: ${Object.keys(data.brands).length} icons, ${svg.length} bytes`);
