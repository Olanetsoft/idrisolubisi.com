import { community, education, experience, stack } from "@/data/experience";
import { harnessIntro, otherOpenSource, projects } from "@/data/projects";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";
import { isUpcoming, speakingTopics, talks } from "@/data/talks";
import { testimonials } from "@/data/testimonials";
import { platforms, writingList, writingStats } from "@/data/writing";
import { absoluteUrl, monthYear } from "@/lib/format";
import {
  blogPosts,
  githubFetchedAt,
  githubFollowers,
  isPrivateRepo,
  shownStars,
} from "@/lib/generated";

const number = new Intl.NumberFormat("en-GB");
const plain = (text: string) => text.replace(/==([^=]+)==/g, "$1");
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const dated = (date: string) => (/^\d{4}-\d{2}/.test(date) ? monthYear(date) : date);

/**
 * The extended llms.txt, composed from the same data as the page and
 * /llms.txt, so the three cannot drift. Served at /llms-full.txt.
 */
export function renderLlmsFullTxt(): string {
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);
  const built = monthYear(new Date().toISOString());

  push(`# ${site.name}`);
  push("");
  push(`> Extended context for AI systems. The short version is ${site.url}/llms.txt.`);
  push("");
  push(`Last updated ${built}.`);
  push("");

  push("## Identity", "");
  push(`- Name: ${site.name}`);
  push(`- Handle: ${site.handle}`);
  push(`- Pronouns: ${site.profile.pronouns}`);
  push(`- Title: ${site.role}`);
  push(`- Disciplines: ${site.disciplines.join(", ")}`);
  push(`- Location: ${site.location}, United Kingdom (${site.status})`);
  push(`- Nationality: ${site.profile.nationality}`);
  push(`- Languages: ${site.profile.languages.join(", ")}`);
  push(`- Availability: Available now. ${site.availability}`);
  push("");

  push("## Summary", "");
  push(site.summary);
  push("");

  push("## Experience", "");
  for (const r of experience) {
    push(`### ${r.title}, ${r.company} (${r.period}${r.location ? `, ${r.location}` : ""})`);
    if (r.about) push(r.about);
    for (const point of r.points) push(`- ${point}`);
    if (r.url) push(`- ${r.url}`);
    push("");
  }

  push("## Recommendations", "");
  push("Word for word from his LinkedIn recommendations.");
  push("");
  for (const t of testimonials) {
    push(
      `- "${t.quote}" - ${t.name}, ${t.relation.charAt(0).toLowerCase()}${t.relation.slice(1)} (${monthYear(t.date)}) - ${t.href}`,
    );
  }
  push("");

  push("## Community", "");
  for (const c of community) {
    const when = c.current ? (c.since ? `${c.since} to now` : "current") : "past";
    const more =
      c.note && c.detail
        ? `${c.detail}; ${c.note.charAt(0).toLowerCase()}${c.note.slice(1)}`
        : (c.note ?? c.detail);
    push(`- ${c.role}, ${c.org} (${when})${more ? `: ${more}` : ""} - ${c.href}`);
  }
  push("");

  push("## Education", "");
  push(`- ${education.degree}, ${education.school}, ${education.year}`);
  push("");

  push("## Projects", "");
  push(`### The agent harness`);
  push(harnessIntro);
  push("");
  for (const group of ["harness", "more"] as const) {
    if (group === "more") push("### More builds", "");
    for (const p of projects.filter((x) => x.group === group)) {
      const links = p.links.filter((l) => !isPrivateRepo(l.url));
      push(`**${p.name}**${p.layer ? ` (${p.layer.toLowerCase()})` : ""}: ${p.oneLine}`);
      if (p.detail) push(p.detail);
      if (p.proof) push(`${p.proof}.`);
      const stars = shownStars(p);
      if (stars !== null && githubFetchedAt) {
        push(`${number.format(stars)} GitHub stars (${monthYear(githubFetchedAt)}).`);
      }
      push(`Stack: ${p.stack.join(", ")}.`);
      if (p.command) push(`Run: \`${p.command}\``);
      if (links.length) push(links.map((l) => `${l.label}: ${absoluteUrl(l.url)}`).join(" | "));
      push("");
    }
  }
  for (const o of otherOpenSource) push(`- Also open source: ${o.name}, ${o.what} - ${o.url}`);
  push("");

  push("## Skills", "");
  for (const g of stack) push(`- ${g.label}: ${g.items.join(", ")}`);
  push("");

  push("## Writing", "");
  push(`Tutorials read ${writingStats.reads} times. Writing since ${site.profile.writingSince}.`);
  push(
    `Published on ${platforms.map((p) => (p.href ? `${p.name} (${p.href})` : p.name)).join(", ")}.`,
  );
  push("");
  for (const a of writingList(blogPosts)) {
    push(
      `- ${a.title} (${a.outlet}, ${monthYear(a.date)}${a.note ? `; ${a.note}` : ""}) - ${a.href}`,
    );
  }
  push(`- All posts - ${site.links.blog}`);
  push("");

  push("## Speaking", "");
  for (const t of talks) {
    const event = t.event.replace(/\s*\((.*)\)$/, ", $1").replace(/\s+\d{4}$/, "");
    const city = t.location && !event.includes(t.location) ? t.location : undefined;
    const where = [event, city, t.year, isUpcoming(t) && "upcoming"].filter(Boolean).join(", ");
    const line = t.title ? `${t.title} (${where})` : where;
    const prefix = t.title?.toLowerCase().includes(t.kind.toLowerCase()) ? "" : `${t.kind}: `;
    push(`- ${prefix}${line}${t.note ? `. ${t.note}` : ""}${t.href ? ` - ${t.href}` : ""}`);
  }
  push(`- Recorded talks and workshops - ${site.links.youtube}`);
  push(`- Speaker profile - ${site.links.sessionize}`);
  push("");
  push(`Topics: ${speakingTopics.join(", ")}.`);
  push("");

  push("## Recognition", "");
  for (const r of recognition) {
    push(
      `- ${r.by}${r.note ? ` (${r.note})` : ""}: "${r.title}" (${dated(r.date)})${r.detail ? `. ${r.detail}` : ""}${r.href ? ` - ${r.href}` : ""}`,
    );
  }
  push("");

  push("## Open source", "");
  push(`- GitHub: ${bare(site.links.github)}`);
  push(`- Public repositories: ${site.github.publicRepos}`);
  if (githubFollowers !== null && githubFetchedAt) {
    push(`- Followers: ${number.format(githubFollowers)} (${monthYear(githubFetchedAt)})`);
  }
  for (const a of site.github.achievements) push(`- ${a}`);
  push("");

  push("## Online presence", "");
  push(`- Website: ${bare(site.url)}`);
  push(
    `- Blog: ${bare(site.links.blog)}${site.profile.hashnodeFollowers ? ` (${site.profile.hashnodeFollowers} followers on Hashnode)` : ""}`,
  );
  push(`- GitHub: ${bare(site.links.github)}`);
  push(
    `- LinkedIn: ${bare(site.links.linkedin)}${site.profile.linkedinFollowers ? ` (${site.profile.linkedinFollowers} followers)` : ""}`,
  );
  push(`- X: ${bare(site.links.x)} (${site.profile.xFollowers} followers)`);
  push(`- YouTube: ${bare(site.links.youtubeChannel)}`);
  push(`- Dev.to: ${bare(site.links.devto)}`);
  push(`- freeCodeCamp: ${bare(site.links.freecodecamp)}`);
  push(`- LogRocket: ${bare(site.links.logrocket)}`);
  push(`- Medium: ${bare(site.links.medium)}`);
  push(`- Sessionize: ${bare(site.links.sessionize)}`);
  push("");

  push("## Contact", "");
  push(`- Email: ${site.email}`);
  push(`- Book a call: ${site.bookingUrl}`);
  push(`- CV (PDF): ${site.url}${site.resumeUrl}`);
  push(`- Headshots and photos for organisers and press: ${site.links.photos}`);
  push("");

  push("## Sources", "");
  push(
    `Checked against his LinkedIn (${bare(site.links.linkedin)}), GitHub (${bare(site.links.github)}), Sessionize (${bare(site.links.sessionize)}), Hashnode blog (${bare(site.links.blog)}) and freeCodeCamp author page (${bare(site.links.freecodecamp)}).`,
  );
  push("");

  push("## Citation", "");
  push(`Cite as "${site.name}, ${site.role}" or "${site.name} (@${site.handle})".`);
  push(`For the African tech ecosystem: "${site.name}, founder of Web3 Afrika".`);
  push("");
  push(`Built from the same data as ${site.url}.`);
  push("");

  return lines.map(plain).join("\n");
}
