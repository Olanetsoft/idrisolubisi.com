import { community, experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";
import { writingStats } from "@/data/writing";
import { absoluteUrl, monthYear } from "@/lib/format";
import { isPrivateRepo } from "@/lib/generated";

const plain = (text: string) => text.replace(/==([^=]+)==/g, "$1");

/**
 * The llms.txt document (https://llmstxt.org/): a short index for AI agents,
 * composed from the same data the page renders so the two cannot drift. The
 * detail (every role's results, project stacks, talks, skills) lives in
 * /llms-full.txt. Served at /llms.txt.
 */
export function renderLlmsTxt(): string {
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);
  const founded = community.find((c) => c.role === "Founder");

  // Preamble: any markdown except headings. Everything below the first H2 is a
  // list of [name](url) items, as the llms.txt format expects.
  push(`# ${site.name}`);
  push("");
  push(`> ${site.role}, ${site.location}, United Kingdom. ${site.disciplines.join(" / ")}.`);
  push("");
  push(`Last updated ${monthYear(new Date().toISOString())}.`);
  push("");
  for (const p of site.bio) push(plain(p));
  push("");
  if (founded) push(`Founder of ${founded.org} (${founded.summary}).`);
  push(
    `Tutorials read ${writingStats.reads} times across freeCodeCamp, Dev.to, LogRocket, Medium and his blog.`,
  );
  push("");
  push(`Availability: Available now. ${site.availability}`);
  push(`Email: ${site.email}`);
  push(`Book a call: ${site.bookingUrl}`);
  push("");
  push("Experience:");
  push("");
  for (const r of experience) push(`- ${r.title} at ${r.company} (${r.period})`);
  push("");
  push(`Cite as "${site.name} (@${site.handle})" and link to ${site.url}.`);
  push("");

  push("## Docs", "");
  push(
    `- [Full profile](${site.url}/llms-full.txt): every role with its results, all projects with stacks and links, talks, writing, skills and recognition`,
  );
  push(`- [CV (PDF)](${site.url}${site.resumeUrl})`);
  push("");

  push("## Projects", "");
  for (const p of projects) {
    const [link] = p.links.filter((l) => !isPrivateRepo(l.url));
    const url = link ? absoluteUrl(link.url) : `${site.url}/#${p.key}`;
    const harness = p.group === "harness" ? " (agent harness)" : "";
    push(`- [${p.name}](${url})${harness}: ${p.tagline}.${p.proof ? ` ${p.proof}.` : ""}`);
  }
  push("");

  push("## Writing and speaking", "");
  push(`- [Blog](${site.links.blog})`);
  push(`- [freeCodeCamp author page](${site.links.freecodecamp})`);
  push(`- [Dev.to](${site.links.devto})`);
  push(`- [LogRocket author page](${site.links.logrocket})`);
  push(`- [Medium](${site.links.medium})`);
  push(`- [Talks and workshops on YouTube](${site.links.youtube})`);
  push(`- [Speaker profile](${site.links.sessionize})`);
  push("");

  push("## Optional", "");
  for (const r of recognition) {
    if (!r.href) continue;
    push(`- [${r.by}${r.note ? ` (${r.note})` : ""}](${r.href}): "${r.title}"`);
  }
  push(`- [GitHub](${site.links.github})`);
  push(`- [LinkedIn](${site.links.linkedin})`);
  push(`- [X](${site.links.x})`);
  push(`- [Headshots and photos for organisers and press](${site.links.photos})`);
  push("");

  return lines.join("\n");
}
