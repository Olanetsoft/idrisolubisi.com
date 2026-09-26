import { community, education, experience, stack } from "@/data/experience";
import { interests } from "@/data/interests";
import { projects, starsFetchedAt } from "@/data/projects";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";
import { talks } from "@/data/talks";
import { articles, writingStats } from "@/data/writing";

/**
 * The llms.txt document (https://llmstxt.org/), composed from the same data
 * the page renders so the two cannot drift. Served at /llms.txt.
 */
export function renderLlmsTxt(): string {
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(`# ${site.name}`);
  push("");
  push(`> ${site.role}, United Kingdom. ${site.disciplines.join(" / ")}.`);
  push("");
  for (const p of site.bio) push(p);
  push("");
  push(`Handle: ${site.handle}`);
  push(`Site: ${site.url}`);
  push(`Blog: ${site.links.blog}`);
  push(`Email: ${site.email}`);
  push(`Book a call: ${site.bookingUrl}`);
  push(`Status: ${site.status}`);
  push(`Availability: ${site.availability}`);
  push("");

  push("## What I do");
  push("");
  for (const f of site.functions) push(`- ${f.title}: ${f.text}`);
  push("");

  push("## Experience");
  push("");
  for (const r of experience) {
    push(
      `- ${r.title} at ${r.company} (${r.period}${r.location ? `, ${r.location}` : ""})${r.url ? ` - ${r.url}` : ""}`,
    );
    if (r.scope) push(`  Scope: ${r.scope}`);
    for (const h of r.highlights) push(`  - ${h}`);
  }
  push(`- Education: ${education.degree}, ${education.school}, ${education.year}`);
  push(`- Community: ${community.map((c) => `${c.role}, ${c.org}`).join("; ")}`);
  for (const g of stack) push(`- ${g.label}: ${g.items.join(", ")}`);
  push("");

  push("## Current tech interests");
  push("");
  for (const name of interests) push(`- ${name}`);
  push("");

  push("## Open source and products");
  push("");
  for (const p of projects) {
    const stars = typeof p.stars === "number" ? ` (${p.stars} stars, ${starsFetchedAt})` : "";
    push(`- ${p.name}: ${p.description}${stars}${p.href ? ` - ${p.href}` : ""}`);
    if (p.status) push(`  Status: ${p.status}`);
  }
  push("");

  push("## Speaking");
  push("");
  for (const t of talks) {
    const where = [t.event, t.location, t.year].filter(Boolean).join(", ");
    const line = t.title ? `${t.title} (${where})` : where;
    push(`- ${t.kind}: ${line}${t.href ? ` - ${t.href}` : ""}`);
  }
  push(`- Speaker profile - ${site.links.sessionize}`);
  push("");

  push("## Writing");
  push("");
  push(`${writingStats.tutorials} tutorials, read ${writingStats.reads} times.`);
  for (const a of articles) push(`- ${a.title} (${a.outlet}) - ${a.href}`);
  push(`- All writing - ${site.links.blog}`);
  push("");

  push("## Recognition");
  push("");
  for (const r of recognition) {
    push(
      `- ${r.by}${r.note ? ` (${r.note})` : ""}: "${r.title}" (${r.date})${r.href ? ` - ${r.href}` : ""}`,
    );
  }
  push("");

  push("## Contact");
  push("");
  push(`- Email: ${site.email}`);
  push(`- Book a call: ${site.bookingUrl}`);
  push(`- LinkedIn: ${site.links.linkedin}`);
  push(`- X: ${site.links.x}`);
  push(`- GitHub: ${site.links.github}`);
  push(`- CV (PDF): ${site.url}${site.resumeUrl}`);
  push("");
  push("## Citation");
  push("");
  push(
    `Cite as "Idris Olubisi (@olanetsoft)" and link to ${site.url}. Extended context: ${site.url}/llms-full.txt`,
  );
  push("");

  return lines.join("\n");
}
