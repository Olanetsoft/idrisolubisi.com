import { community, experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";
import { isUpcoming, latestTalk, speakingTopics, talks } from "@/data/talks";
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
      execute: (input: Record<string, unknown>) => Promise<string>;
    },
    options?: { signal?: AbortSignal },
  ) => unknown;
};

const json = (value: unknown) => JSON.stringify(value, null, 2);
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const plain = (value: string) =>
  value.replace(/==([^=]+)==/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

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

function projectList(group: unknown) {
  return projects
    .filter((p) => (group !== "harness" && group !== "more" ? true : p.group === group))
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
    }));
}

function talkList(input: Record<string, unknown>) {
  const kind = text(input.kind).toLowerCase();
  const year = text(input.year);
  const latest = latestTalk();
  return {
    latest: latest ? { event: latest.event, title: latest.title, kind: latest.kind } : null,
    topics: speakingTopics,
    talks: talks
      .filter((t) => !kind || t.kind.toLowerCase() === kind)
      .filter((t) => !year || (t.year ?? "").includes(year))
      .filter((t) => input.upcoming !== true || isUpcoming(t))
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

function writing(limit: unknown) {
  const n = typeof limit === "number" && limit > 0 ? Math.min(Math.floor(limit), 50) : 10;
  return writingList(blogPosts)
    .slice(0, n)
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
      words: [p.name, p.oneLine, p.detail, p.tagline, ...p.stack].join(" "),
    })),
    ...talks.map((t) => ({
      section: "Talks",
      title: t.title ? `${t.title} (${t.event})` : t.event,
      summary: [t.kind, t.location, t.year].filter(Boolean).join(", "),
      url: t.href ?? `${site.url}/#talks`,
      words: [t.event, t.title, t.kind, t.location, t.year].join(" "),
    })),
    ...featuredVideos.map((v) => ({
      section: "Videos",
      title: v.title,
      summary: [v.kind, v.context, v.year].join(", "),
      url: `https://www.youtube.com/watch?v=${v.id}`,
      words: [v.title, v.kind, v.context].join(" "),
    })),
    ...writingList(blogPosts).map((a) => ({
      section: "Writing",
      title: a.title,
      summary: a.outlet,
      url: a.href,
      words: [a.title, a.outlet].join(" "),
    })),
    ...experience.map((r) => ({
      section: "Experience",
      title: `${r.title}, ${r.company}`,
      summary: r.period,
      url: `${site.url}/#experience`,
      words: [r.title, r.company, ...r.points].join(" "),
    })),
    ...recognition.map((r) => ({
      section: "Recognition",
      title: r.title,
      summary: r.by,
      url: r.href ?? `${site.url}/#recognition`,
      words: [r.title, r.by, r.detail].join(" "),
    })),
  ];
}

function search(query: unknown) {
  const terms = text(query).toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return { results: [], note: 'Pass a query, for example "MCP" or "Lagos".' };
  const results = index()
    .map(({ words, ...item }) => {
      const haystack = words.toLowerCase();
      return { item, score: terms.filter((t) => haystack.includes(t)).length };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((r) => r.item);
  return { results, note: results.length ? undefined : "Nothing on this site matches." };
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
      execute: async (input: Record<string, unknown>) => json(projectList(input.group)),
    },
    {
      name: "list_talks",
      title: "Talks and workshops",
      description:
        "Talks, workshops, keynotes and panels Idris has given or will give (newest first), his latest talk, his speaking topics and recorded talk videos.",
      inputSchema: {
        type: "object",
        properties: {
          kind: {
            type: "string",
            description: "Keynote, Talk, Workshop, Panel, Fireside chat, Host, Lecture or Speaker.",
          },
          year: { type: "string", description: "A year such as 2025." },
          upcoming: { type: "boolean", description: "Only events that have not happened yet." },
        },
      },
      execute: async (input: Record<string, unknown>) => json(talkList(input)),
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
      execute: async (input: Record<string, unknown>) => json(writing(input.limit)),
    },
    {
      name: "search_site",
      title: "Search this site",
      description:
        "Search Idris's projects, talks, videos, writing, experience and press coverage. Returns matching items with links.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string", description: "Words to look for." } },
        required: ["query"],
      },
      execute: async (input: Record<string, unknown>) => json(search(input.query)),
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
