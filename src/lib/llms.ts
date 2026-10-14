import { community, education, experience, stack } from "@/data/experience";
import { harnessIntro, projects } from "@/data/projects";
import { blogPosts, githubFetchedAt, isPrivateRepo, starsFor } from "@/lib/generated";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";
import { talks } from "@/data/talks";
import { writingList, writingStats } from "@/data/writing";

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
    for (const point of r.points) push(`  - ${point}`);
  }
  push(`- Education: ${education.degree}, ${education.school}, ${education.year}`);
  const line = (c: (typeof community)[number]) =>
    `${c.role}, ${c.org}${c.note ? ` (${c.note})` : ""}`;
  push(
    `- Community, current: ${community
      .filter((c) => c.current)
      .map(line)
      .join("; ")}`,
  );
  push(
    `- Community, past: ${community
      .filter((c) => !c.current)
      .map(line)
      .join("; ")}`,
  );
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
      `- ${p.name}${p.group === "harness" ? " (agent harness)" : ""}: ${p.oneLine}${p.proof ? ` ${p.proof}.` : ""}${starNote}`,
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
  for (const a of writingList(blogPosts)) push(`- ${a.title} (${a.outlet}, ${a.date}) - ${a.href}`);
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
