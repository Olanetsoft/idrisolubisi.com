// Downloads the CV from Google Docs as a PDF and saves it as
// public/Idris-Olubisi-CV.pdf with a clean document title, which browsers show
// in the tab. Run after editing the Doc: npm run cv
import { writeFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";

const DOC_ID = "1dcUOmgfnAsRihGTNqbpKRo_2-zF8boUz";
const OUT = new URL("../public/Idris-Olubisi-CV.pdf", import.meta.url);

const res = await fetch(`https://docs.google.com/document/d/${DOC_ID}/export?format=pdf`);
const type = res.headers.get("content-type") ?? "";
if (!res.ok || !type.includes("pdf")) {
  console.error(
    `refresh-cv: export failed (${res.status}, ${type}). Is the Doc shared as "Anyone with the link"?`,
  );
  process.exit(1);
}

const pdf = await PDFDocument.load(await res.arrayBuffer());
pdf.setTitle("Idris Olubisi, CV", { showInWindowTitleBar: true });
pdf.setAuthor("Idris Olubisi");
pdf.setSubject("Curriculum vitae");
await writeFile(OUT, await pdf.save());
console.log(`refresh-cv: saved ${pdf.getPageCount()} pages to public/Idris-Olubisi-CV.pdf`);
