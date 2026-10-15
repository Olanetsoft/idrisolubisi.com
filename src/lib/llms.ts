import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";
import { writingStats } from "@/data/writing";
import { monthYear } from "@/lib/format";
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

  push(`# ${site.name}`);
  push("");
  push(`> ${site.role}, ${site.location}, United Kingdom. ${site.disciplines.join(" / ")}.`);
  push("");
  push(`Last updated ${monthYear(new Date().toISOString())}.`);
  push("");
  for (const p of site.bio) push(plain(p));
  push("");
  push(`Availability: Available now. ${site.availability}`);
  push(`Email: ${site.email}`);
  push(`Book a call: ${site.bookingUrl}`);
  push("");

  push("## Experience", "");
  for (const r of experience) push(`- ${r.title}, ${r.company} (${r.period})`);
  push("");

  push("## Projects", "");
  for (const p of projects) {
    const [link] = p.links.filter((l) => !isPrivateRepo(l.url));
    const name = link ? `[${p.name}](${link.url})` : p.name;
    const harness = p.group === "harness" ? " (agent harness)" : "";
    push(`- ${name}${harness}: ${p.tagline}.${p.proof ? ` ${p.proof}.` : ""}`);
  }
  push("");

  push("## Writing and speaking", "");
  push(`- [Blog](${site.links.blog}): tutorials read ${writingStats.reads} times`);
  push(
    `- Author pages: [freeCodeCamp](${site.links.freecodecamp}), [Dev.to](${site.links.devto}), [LogRocket](${site.links.logrocket}), [Medium](${site.links.medium})`,
  );
  push(`- [Talks and workshops on YouTube](${site.links.youtube})`);
  push(`- [Speaker profile](${site.links.sessionize})`);
  push("");

  push("## Recognition", "");
  for (const r of recognition) {
    const by = `${r.by}${r.note ? ` (${r.note})` : ""}`;
    push(`- ${r.href ? `[${by}](${r.href})` : by}: "${r.title}"`);
  }
  push("");

  push("## Profiles", "");
  push(`- [GitHub](${site.links.github})`);
  push(`- [LinkedIn](${site.links.linkedin})`);
  push(`- [X](${site.links.x})`);
  push(`- [CV (PDF)](${site.url}${site.resumeUrl})`);
  push(`- [Headshots and photos for organisers and press](${site.links.photos})`);
  push("");

  push("## Optional", "");
  push(
    `- [Extended context](${site.url}/llms-full.txt): every role with its results, all projects with stacks and links, talks, writing, skills and recognition`,
  );
  push("");

  push("## Citation", "");
  push(`Cite as "${site.name} (@${site.handle})" and link to ${site.url}.`);
  push("");

  return lines.join("\n");
}
