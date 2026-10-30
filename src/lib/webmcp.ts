import { community, experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";
import { TALK_KINDS, isUpcoming, latestTalk, speakingTopics, talks } from "@/data/talks";
import { featuredVideos } from "@/data/videos";
import { writingList } from "@/data/writing";
import { absoluteUrl } from "@/lib/format";
import { blogPosts, isPrivateRepo } from "@/lib/generated";

/**
 * WebMCP tools (https://webmachinelearning.github.io/webmcp/): read-only
 * functions an AI agent in the browser can call to ask this site about Idris
 * instead of scraping it. They read the same data files as the page,
 * /llms.txt and the JSON-LD, so all of them agree. Each one returns JSON as
 * text. AgentTools loads this module only when the browser has the API.
 */

/** The browser's model context: document.modelContext in the current draft, navigator.modelContext in older builds and polyfills. */
export type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      title?: string;
      description: string;
      inputSchema?: object;
      annotations?: { readOnlyHint?: boolean };
      // The browser may pass no input object at all.
      execute: (input?: Record<string, unknown> | null) => Promise<string>;
    },
    options?: { signal?: AbortSignal },
  ) => unknown;
};

const json = (value: unknown) => JSON.stringify(value, null, 2);
/** A string or a number as trimmed text, anything else as "": agents send 2026 as often as "2026". */
const str = (value: unknown) =>
  typeof value === "string"
    ? value.trim()
    : typeof value === "number" && Number.isFinite(value)
      ? String(value)
      : "";
const yes = (value: unknown) => value === true || str(value).toLowerCase() === "true";
/** A count from 1 to `max`, or `fallback` when missing or not a number. */
const count = (value: unknown, fallback: number, max: number) => {
  const n = Number(str(value));
  return Number.isFinite(n) && n >= 1 ? Math.min(Math.floor(n), max) : fallback;
};
const plain = (value: string) =>
  value.replace(/==([^=]+)==/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
/** Words as lowercase letters and digits: "cross-chain" is "cross" and "chain". */
const tokens = (value: string) => value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

/** The years a talk covers: "2025–26" is 2025 and 2026. */
function yearsOf(year?: string): number[] {
  const m = (year ?? "").match(/^(\d{4})(?:\s*[–-]\s*(\d{2}|\d{4}))?$/);
  if (!m) return [];
  const start = Number(m[1]);
  const end = m[2] ? Number(m[2].length === 2 ? m[1].slice(0, 2) + m[2] : m[2]) : start;
  return Array.from({ length: Math.max(0, end - start) + 1 }, (_, i) => start + i);
}

function profile() {
  return {
    name: site.name,
    role: site.role,
    disciplines: site.disciplines,
    location: site.location,
    availability: site.availability,
    bio: site.description,
    shortBio: site.shortBio,
    intro: plain(site.bio[0]),
    experience: experience.map((r) => ({ title: r.title, company: r.company, period: r.period })),
    community: community.map((c) => ({ org: c.org, role: c.role, url: c.href })),
    contact: {
      bookACall: site.bookingUrl,
      email: site.email,
      cv: absoluteUrl(site.resumeUrl),
      speakerProfile: site.links.sessionize,
      headshots: site.links.photos,
    },
    links: {
      site: site.url,
      github: site.links.github,
      linkedin: site.links.linkedin,
      x: site.links.x,
      blog: site.links.blog,
      youtube: site.links.youtubeChannel,
      llmsTxt: `${site.url}/llms.txt`,
      llmsFullTxt: `${site.url}/llms-full.txt`,
    },
  };
}

function projectList(input: Record<string, unknown>) {
  const group = str(input.group).toLowerCase();
  if (group && group !== "harness" && group !== "more") {
    return {
      note: `Unknown group "${group}". Use "harness" or "more", or leave it out.`,
      projects: [],
    };
  }
  return {
    projects: projects
      .filter((p) => !group || p.group === group)
      .map((p) => ({
        name: p.name,
        group: p.group === "harness" ? "agent harness" : "more builds",
        summary: p.oneLine,
        detail: p.detail,
        proof: p.proof,
        stack: p.stack,
        links: p.links
          .filter((l) => !isPrivateRepo(l.url))
          .map((l) => ({ label: l.label, url: absoluteUrl(l.url) })),
      })),
  };
}

function talkList(input: Record<string, unknown>) {
  // "workshops" and "Workshop" both mean Workshop.
  const asked = str(input.kind).toLowerCase();
  const kind = TALK_KINDS.find((k) => [asked, asked.replace(/s$/, "")].includes(k.toLowerCase()));
  if (asked && !kind) {
    return { note: `Unknown kind "${asked}". Use one of: ${TALK_KINDS.join(", ")}.`, talks: [] };
  }
  const yearText = str(input.year);
  if (yearText && !/^\d{4}$/.test(yearText)) {
    return { note: "Give the year as four digits, such as 2025.", talks: [] };
  }
  const year = Number(yearText);
  const upcoming = yes(input.upcoming);
  const latest = latestTalk();
  return {
    latest: latest ? { event: latest.event, title: latest.title, kind: latest.kind } : null,
    topics: speakingTopics,
    talks: talks
      .filter((t) => !kind || t.kind === kind)
      .filter((t) => !year || yearsOf(t.year).includes(year))
      .filter((t) => !upcoming || isUpcoming(t))
      .map((t) => ({
        event: t.event,
        title: t.title,
        kind: t.kind,
        year: t.year,
        location: t.location,
        upcoming: isUpcoming(t) || undefined,
        note: t.note,
        url: t.href,
      })),
    videos: featuredVideos.map((v) => ({
      title: v.title,
      kind: v.kind,
      context: v.context,
      year: v.year,
      url: `https://www.youtube.com/watch?v=${v.id}${v.start ? `&t=${v.start}s` : ""}`,
    })),
    allRecordings: site.links.youtube,
  };
}

function writing(input: Record<string, unknown>) {
  return writingList(blogPosts)
    .slice(0, count(input.limit, 10, 50))
    .map((a) => ({ title: a.title, outlet: a.outlet, date: a.date, url: a.href }));
}

/** Every searchable item once: what it is, where it is, and the words to match. */
function index() {
  return [
    ...projects.map((p) => ({
      section: "Projects",
      title: p.name,
      summary: p.oneLine,
      url: absoluteUrl(p.links.find((l) => !isPrivateRepo(l.url))?.url ?? `/#${p.key}`),
      words: [p.oneLine, p.detail, p.tagline, ...p.stack].join(" "),
    })),
    ...talks.map((t) => ({
      section: "Talks",
      title: t.title ? `${t.title} (${t.event})` : t.event,
      summary: [t.kind, t.location, t.year].filter(Boolean).join(", "),
      url: t.href ?? `${site.url}/#talks`,
      words: [t.kind, t.location, t.year].join(" "),
    })),
    ...featuredVideos.map((v) => ({
      section: "Videos",
      title: v.title,
      summary: [v.kind, v.context, v.year].join(", "),
      url: `https://www.youtube.com/watch?v=${v.id}`,
      words: [v.kind, v.context].join(" "),
    })),
    ...writingList(blogPosts).map((a) => ({
      section: "Writing",
      title: a.title,
      summary: a.outlet,
      url: a.href,
      words: a.outlet,
    })),
    ...experience.map((r) => ({
      section: "Experience",
      title: `${r.title}, ${r.company}`,
      summary: r.period,
      url: `${site.url}/#experience`,
      words: r.points.join(" "),
    })),
    ...recognition.map((r) => ({
      section: "Recognition",
      title: r.title,
      summary: r.by,
      url: r.href ?? `${site.url}/#recognition`,
      words: [r.by, r.detail].join(" "),
    })),
  ];
}

function search(input: Record<string, unknown>) {
  const terms = [...new Set(tokens(str(input.query)))];
  if (!terms.length) {
    return { results: [], total: 0, note: 'Pass a query, for example "MCP" or "Lagos".' };
  }
  // A word matches itself; words of four letters or more also match longer
  // words they start, so "agent" finds "agents" but "ai" does not find "aim".
  const matched = (words: Set<string>) =>
    terms.filter((t) => [...words].some((w) => w === t || (t.length >= 4 && w.startsWith(t))));
  const scored = index()
    .map(({ words, ...item }) => ({
      item,
      hits: matched(new Set(tokens(`${item.title} ${words}`))).length,
      inTitle: matched(new Set(tokens(item.title))).length,
    }))
    .filter((r) => r.hits > 0);
  const everyWord = scored.filter((r) => r.hits === terms.length);
  const pool = (everyWord.length ? everyWord : scored).sort(
    (a, b) => b.hits - a.hits || b.inTitle - a.inTitle,
  );
  // Within equal scores, take one item per section in turn, so a broad word
  // does not fill every slot with projects before talks or writing appear.
  const spread: typeof pool = [];
  for (const score of [...new Set(pool.map((r) => `${r.hits}:${r.inTitle}`))]) {
    const bySection = new Map<string, typeof pool>();
    for (const r of pool.filter((x) => `${x.hits}:${x.inTitle}` === score)) {
      bySection.set(r.item.section, [...(bySection.get(r.item.section) ?? []), r]);
    }
    const lists = [...bySection.values()];
    for (let i = 0; lists.some((l) => l[i]); i++)
      for (const l of lists) if (l[i]) spread.push(l[i]);
  }
  const limit = count(input.limit, 12, 50);
  const results = spread.slice(0, limit).map((r) => r.item);
  const notes = [
    !pool.length && "Nothing on this site matches.",
    pool.length &&
      !everyWord.length &&
      `No item matches all of: ${terms.join(", ")}; these match some of the words.`,
    pool.length > results.length &&
      `Showing ${results.length} of ${pool.length}. Narrow the query, raise the limit, or use list_projects, list_talks or list_writing for full lists.`,
  ].filter(Boolean);
  return { results, total: pool.length, note: notes.join(" ") || undefined };
}

/** Registers the tools; aborting the signal removes them. */
export function registerSiteTools(context: ModelContext, signal: AbortSignal) {
  const readOnly = { readOnlyHint: true };
  const tools = [
    {
      name: "get_profile",
      title: "About Idris Olubisi",
      description:
        "Who Idris Olubisi is: role, short and full bio, availability for work, location, roles held, communities, and how to book a call, email him or download his CV.",
      inputSchema: { type: "object", properties: {} },
      execute: async () => json(profile()),
    },
    {
      name: "list_projects",
      title: "Projects",
      description:
        "Projects Idris has built: the agent harness (SwoopAgent, the Midnight MCP server, Agent Lookout) and more builds, each with what it does, proof, stack and links.",
      inputSchema: {
        type: "object",
        properties: {
          group: {
            type: "string",
            enum: ["harness", "more"],
            description: "Only the agent harness, or only the more builds. Omit for all.",
          },
        },
      },
      execute: async (input?: Record<string, unknown> | null) => json(projectList(input ?? {})),
    },
    {
      name: "list_talks",
      title: "Talks and workshops",
      description:
        "Talks, workshops, keynotes and panels Idris has given or will give (newest first), his latest talk, his speaking topics and recorded talk videos.",
      inputSchema: {
        type: "object",
        properties: {
          kind: { type: "string", enum: [...TALK_KINDS], description: "The kind of event." },
          year: {
            type: "string",
            pattern: "^\\d{4}$",
            description: "A four-digit year such as 2025. Talks spanning years match each year.",
          },
          upcoming: { type: "boolean", description: "Only events that have not happened yet." },
        },
      },
      execute: async (input?: Record<string, unknown> | null) => json(talkList(input ?? {})),
    },
    {
      name: "list_writing",
      title: "Writing",
      description:
        "Selected articles and tutorials by Idris, newest first, with the outlet, month and link.",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "How many to return, up to 50. Defaults to 10." },
        },
      },
      execute: async (input?: Record<string, unknown> | null) => json(writing(input ?? {})),
    },
    {
      name: "search_site",
      title: "Search this site",
      description:
        "Search Idris's projects, talks, videos, writing, experience and press coverage. Returns the items that match every word (or, failing that, some of them) with links, and the total.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Words to look for." },
          limit: { type: "number", description: "How many to return, up to 50. Defaults to 12." },
        },
        required: ["query"],
      },
      execute: async (input?: Record<string, unknown> | null) => json(search(input ?? {})),
    },
  ];
  for (const tool of tools) {
    // Async so a refusal, thrown or rejected (a name taken, an older draft),
    // costs that one tool and not the rest.
    (async () => context.registerTool({ ...tool, annotations: readOnly }, { signal }))().catch(
      () => {},
    );
  }
}
