import { community, education, experience, stack } from "@/data/experience";
import { harnessIntro, projects } from "@/data/projects";
import { githubFetchedAt, isPrivateRepo, starsFor } from "@/lib/generated";
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
  for (const p of site.bio) push(p.replace(/==([^=]+)==/g, "$1"));
  push("");
  push(`Handle: ${site.handle}`);
  push(`Site: ${site.url}`);
  push(`Blog: ${site.links.blog}`);
  push(`Email: ${site.email}`);
  push(`Book a call: ${site.bookingUrl}`);
  push(`Status: ${site.status}`);
  push(`Availability: Available now. ${site.availability} No sponsorship needed.`);
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

  push("## Projects");
  push("");
  push(`Agent harness: ${harnessIntro}`);
  push("");
  for (const p of projects) {
    const stars = p.githubRepo ? starsFor(p.githubRepo) : null;
    const starNote = stars !== null ? ` ${stars} GitHub stars (${githubFetchedAt}).` : "";
    push(
      `- ${p.name}${p.group === "harness" ? " (agent harness)" : ""}: ${p.oneLine} ${p.proof}.${starNote}`,
    );
    const links = p.links.filter((l) => !isPrivateRepo(l.url));
    push(
      `  Stack: ${p.stack.join(", ")}.${links.length ? ` Links: ${links.map((l) => `${l.label} ${l.url}`).join(", ")}` : ""}`,
    );
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
