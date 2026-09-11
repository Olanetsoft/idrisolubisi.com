import { caseStudies } from "@/data/case-studies";
import { community, education, experience, stack } from "@/data/experience";
import { projects, starsFetchedAt } from "@/data/projects";
import { site } from "@/data/site";
import { talks } from "@/data/talks";
import { articles, press, writingProvenance } from "@/data/writing";

/**
 * The llms.txt document (https://llmstxt.org/) composed from the same data the
 * page renders, so the two cannot drift. Served at /llms.txt and shown inline in
 * the Code section.
 */
export function renderLlmsTxt(): string {
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(`# ${site.name}`);
  push("");
  push(
    `> ${site.role}, ${site.location.replace(", United Kingdom", "")}. Builds documentation, tooling and communities for developers and for the AI agents that read on their behalf. Founder of Web3 Afrika. freeCodeCamp author read more than ten million times.`,
  );
  push("");
  push(`Handle: ${site.handle}`);
  push(`Site: ${site.url}`);
  push(`Blog: ${site.links.blog}`);
  push(`Availability: ${site.availability.from} Looking for ${site.availability.lookingFor}.`);
  push(`Right to work: ${site.availability.rightToWork}`);
  push("");

  push("## Figures");
  push("");
  const tc = site.figures.toolCalls;
  push(`- ${tc.value} ${tc.unit} (${tc.source}, ${tc.asOf}) - ${tc.href}`);
  const dl = site.figures.downloads;
  push(`- ${dl.value} downloads of midnight-mcp (${dl.source}, ${dl.asOf}) - ${dl.href}`);
  push("");

  push("## Work");
  push("");
  for (const c of caseStudies) {
    push(`- ${c.title} (${c.org}, ${c.period}) - ${site.url}/work/${c.slug}`);
    push(`  Output: ${c.output.items.join(" · ")} (${c.output.source}, ${c.output.asOf})`);
    if (c.status) push(`  Status: ${c.status}`);
  }
  push("");

  push("## Talks");
  push("");
  for (const t of talks) {
    const where = [t.event, t.location, t.year].filter(Boolean).join(", ");
    push(`- ${t.kind}: ${t.title} (${where})${t.href ? ` - ${t.href}` : ""}`);
  }
  push(`- Speaker profile - ${site.links.sessionize}`);
  push("");

  push("## Press");
  push("");
  for (const p of press) {
    push(`- ${p.outlet}${p.independent ? "" : " (brand press, not editorial)"}: "${p.headline}" (${p.date}) - ${p.href}`);
  }
  push("");

  push("## Writing");
  push("");
  push(`Reach: ${writingProvenance.items.join(" · ")} (${writingProvenance.source}, ${writingProvenance.asOf}).`);
  for (const a of articles) push(`- ${a.title} (${a.outlet}) - ${a.href}`);
  push(`- All writing - ${site.links.blog}`);
  push("");

  push("## Career");
  push("");
  for (const r of experience) {
    push(`- ${r.title}, ${r.company} (${r.period})${r.url ? ` - ${r.url}` : ""}`);
    for (const h of r.highlights) push(`  - ${h}`);
  }
  push(`- Education: ${education.degree}, ${education.school}, ${education.year}`);
  push(`- Community: ${community.map((c) => `${c.role}, ${c.org}`).join("; ")}`);
  push(`- Stack: ${stack.join(", ")}`);
  push("");

  push("## Code");
  push("");
  for (const p of projects) {
    const stars = typeof p.stars === "number" ? ` (${p.stars} stars, ${starsFetchedAt})` : "";
    push(`- ${p.name}: ${p.description}${stars}${p.href ? ` - ${p.href}` : ""}`);
    if (p.status) push(`  Status: ${p.status}`);
  }
  push("");

  push("## Contact");
  push("");
  if (site.email) push(`- Email: ${site.email}`);
  push(`- LinkedIn: ${site.links.linkedin}`);
  push(`- X: ${site.links.x}`);
  push(`- GitHub: ${site.links.github}`);
  push(`- CV: ${site.url}${site.resumeUrl}`);
  push("");
  push("## Citation");
  push("");
  push(`Cite as "Idris Olubisi (@olanetsoft)" and link to ${site.url}. Extended context: ${site.url}/llms-full.txt`);
  push("");

  return lines.join("\n");
}

export function firstLines(n: number): string {
  return renderLlmsTxt().split("\n").slice(0, n).join("\n");
}
