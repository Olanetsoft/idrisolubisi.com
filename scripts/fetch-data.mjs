// Build-time data pipeline: fetches GitHub repo stats and the follower count,
// and the newest posts from the blog's RSS feed, then writes them to
// src/data/generated/*.json for the site to import.
// Run with: node scripts/fetch-data.mjs (optionally with GITHUB_TOKEN set).
//
// This script must never fail a build. Network or parse errors log a one-line
// warning and leave the existing JSON untouched; a missing file is replaced by
// an empty but valid structure. The process always exits 0.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const REPOS = [
  "Olanetsoft/swoopagent-claw",
  "Olanetsoft/midnight-mcp",
  "Olanetsoft/agent-lookout",
  "midnightntwrk/create-mn-app",
  "Olanetsoft/create-mn-app",
  "Olanetsoft/compact-playground",
  "axelarnetwork/foundry-axelar-gmp-example",
  "Olanetsoft/article-idea-generator",
  "Olanetsoft/audioboost",
  "midnightntwrk/example-zkloan",
  "Olanetsoft/learn-compact",
  "Olanetsoft/web3terms",
];
const GITHUB_USER = "Olanetsoft";
const TIMEOUT_MS = 10_000;

const OUT_DIR = new URL("../src/data/generated/", import.meta.url);
const GITHUB_FILE = new URL("github.json", OUT_DIR);
const BLOG_FILE = new URL("blog.json", OUT_DIR);
const BLOG_FEED = "https://blog.idrisolubisi.com/rss.xml";

const today = new Date().toISOString().slice(0, 10);
const log = (msg) => console.log(`fetch-data: ${msg}`);
const warn = (msg) => console.warn(`fetch-data: warning: ${msg}`);

/** fetch with a hard timeout that also covers reading the body. */
async function fetchWithTimeout(url, { headers = {}, as = "json" } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    const body = res.ok ? await (as === "json" ? res.json() : res.text()) : null;
    return { status: res.status, ok: res.ok, body };
  } finally {
    clearTimeout(timer);
  }
}

function describeError(err) {
  if (err?.name === "AbortError") return `timed out after ${TIMEOUT_MS / 1000}s`;
  return err?.cause?.code ?? err?.message ?? String(err);
}

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return null;
  }
}

async function writeJson(file, data) {
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

/** On failure: keep an existing file as is, or create an empty valid one. */
async function keepOrCreate(file, empty, name) {
  if ((await readJson(file)) !== null) {
    log(`${name}: kept existing file`);
    return;
  }
  await writeJson(file, empty);
  log(`${name}: no existing file, wrote empty structure`);
}

// ---------------------------------------------------------------- GitHub

function githubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "idrisolubisi.com-build",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

/** Returns { ok: true, stats } on a definitive answer, or { ok: false } on failure. */
async function fetchRepo(repo) {
  const fallbackUrl = `https://github.com/${repo}`;
  try {
    const res = await fetchWithTimeout(`https://api.github.com/repos/${repo}`, {
      headers: githubHeaders(),
    });
    if (res.status === 404) {
      // Private repos are invisible (404) to unauthenticated callers.
      return { ok: true, stats: { stars: null, language: null, private: true, url: fallbackUrl } };
    }
    if (!res.ok) {
      warn(`github ${repo}: HTTP ${res.status}`);
      return { ok: false };
    }
    const data = res.body;
    const isPrivate = data.private === true;
    return {
      ok: true,
      stats: {
        stars:
          isPrivate || typeof data.stargazers_count !== "number" ? null : data.stargazers_count,
        language: typeof data.language === "string" ? data.language : null,
        private: isPrivate,
        url: typeof data.html_url === "string" ? data.html_url : fallbackUrl,
      },
    };
  } catch (err) {
    warn(`github ${repo}: ${describeError(err)}`);
    return { ok: false };
  }
}

async function fetchFollowers() {
  try {
    const res = await fetchWithTimeout(`https://api.github.com/users/${GITHUB_USER}`, {
      headers: githubHeaders(),
    });
    if (!res.ok) {
      warn(`github followers: HTTP ${res.status}`);
      return { ok: false };
    }
    const followers = res.body?.followers;
    if (typeof followers !== "number") {
      warn("github followers: unexpected response shape");
      return { ok: false };
    }
    return { ok: true, followers };
  } catch (err) {
    warn(`github followers: ${describeError(err)}`);
    return { ok: false };
  }
}

async function updateGithub() {
  const empty = { fetchedAt: null, followers: null, repos: {} };
  const previous = await readJson(GITHUB_FILE);

  const [followerResult, ...repoResults] = await Promise.all([
    fetchFollowers(),
    ...REPOS.map(fetchRepo),
  ]);

  const anySuccess = followerResult.ok || repoResults.some((r) => r.ok);
  if (!anySuccess) {
    warn("github: every request failed");
    await keepOrCreate(GITHUB_FILE, empty, "github.json");
    return;
  }

  // A single failed repo falls back to its last known stats rather than
  // overwriting good data with nulls because of a transient error.
  const repos = {};
  REPOS.forEach((repo, i) => {
    const result = repoResults[i];
    repos[repo] = result.ok
      ? result.stats
      : (previous?.repos?.[repo] ?? {
          stars: null,
          language: null,
          private: false,
          url: `https://github.com/${repo}`,
        });
  });
  const followers = followerResult.ok ? followerResult.followers : (previous?.followers ?? null);

  await writeJson(GITHUB_FILE, { fetchedAt: today, followers, repos });

  const publicCount = Object.values(repos).filter((r) => !r.private).length;
  const failed = repoResults.filter((r) => !r.ok).length;
  log(
    `github.json: ${REPOS.length} repos (${publicCount} public, ${REPOS.length - publicCount} private` +
      `${failed ? `, ${failed} failed` : ""}), followers ${followers ?? "unknown"}`,
  );
}

// ---------------------------------------------------------------- Blog

const NAMED_ENTITIES = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };

/** Decodes XML entities in one pass so "&amp;lt;" correctly yields "&lt;". */
function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n =
        code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** The site forbids em-dashes; rewrite separator dashes into plain punctuation. */
function sanitizeTitle(title) {
  return title
    .replace(/ [—–] /g, ": ")
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagText(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`));
  if (!match) return null;
  const raw = match[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1");
  return decodeEntities(raw).trim();
}

function parseBlogFeed(xml) {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/g) ?? [];
  const posts = [];
  for (const item of items) {
    const title = tagText(item, "title");
    const url = tagText(item, "link");
    const pub = tagText(item, "pubDate");
    const when = pub ? new Date(pub) : null;
    if (!title || !url || !/^https:\/\/blog\.idrisolubisi\.com\//.test(url)) continue;
    if (!when || Number.isNaN(when.getTime())) continue;
    posts.push({ title: sanitizeTitle(title), url, date: when.toISOString().slice(0, 7) });
  }
  return posts;
}

async function updateBlog() {
  const empty = { fetchedAt: null, feed: BLOG_FEED, posts: [] };
  let posts;
  try {
    const res = await fetchWithTimeout(BLOG_FEED, { as: "text" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    posts = parseBlogFeed(res.body);
    // A 200 with nothing parsable (an outage page) must not wipe the data.
    if (posts.length === 0) throw new Error("feed contained no parsable posts");
  } catch (err) {
    warn(`blog: ${describeError(err)}`);
    await keepOrCreate(BLOG_FILE, empty, "blog.json");
    return;
  }
  await writeJson(BLOG_FILE, { fetchedAt: today, feed: BLOG_FEED, posts });
  log(`blog.json: ${posts.length} posts, newest ${posts[0].date}`);
}

// ---------------------------------------------------------------- main

for (const [name, task] of [
  ["github", updateGithub],
  ["blog", updateBlog],
]) {
  try {
    await task();
  } catch (err) {
    warn(`${name}: unexpected error: ${describeError(err)}`);
  }
}
// Let pending stdout drain instead of calling process.exit(); always succeed.
process.exitCode = 0;
