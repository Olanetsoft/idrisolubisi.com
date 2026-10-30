import { lookup, type LookupAddress } from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";

/**
 * The AI readiness check behind /tools/ai-readiness (served by the Netlify
 * function netlify/functions/ai-check.mts). It fetches a handful of public
 * files from one site (the home page, /llms.txt, /llms-full.txt,
 * /robots.txt and a sitemap) and says what an AI agent or crawler would find.
 *
 * Fetching a URL someone typed is the dangerous part, so every request goes
 * through safeGet: http or https on the default ports only, no credentials
 * in the URL, every DNS answer checked against private and internal ranges
 * before connecting (redirects included), a hard time limit and a size cap.
 * Nothing is stored. No other module of the site imports this file.
 */

const TIMEOUT_MS = 5000;
const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 3;
const USER_AGENT =
  "idrisolubisi.com AI readiness check (+https://idrisolubisi.com/tools/ai-readiness)";

/** A problem with what the visitor typed; shown to them as is. */
export class InputError extends Error {}

// ---------- safe fetching ----------

/** Addresses a public check must never reach: loopback, private, link-local, shared, reserved and multicast ranges, in IPv4 and IPv6. */
export function isBlockedAddress(address: string): boolean {
  const ip = address.replace(/^\[|\]$/g, "").toLowerCase();
  if (net.isIPv4(ip)) {
    const [a, b, c] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0 && (c === 0 || c === 2)) ||
      (a === 192 && b === 88 && c === 99) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113) ||
      a >= 224
    );
  }
  if (net.isIPv6(ip)) {
    if (ip === "::" || ip === "::1") return true;
    const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isBlockedAddress(mapped[1]);
    // Anything starting "::" (mapped and compatible forms) and the NAT64,
    // 6to4 and Teredo ranges can carry an internal IPv4 address, so they are
    // refused outright, as are documentation, unique-local, link-local and
    // multicast ranges. Public addresses all sit in 2000::/3.
    return /^(::|64:ff9b:|100::|2001::|2001:0:|2001:db8:|2002:|f[cd]|fe[89ab]|ff)/.test(ip);
  }
  return true;
}

/** A DNS lookup that refuses to hand back any blocked address, so a public name cannot point the check inward. */
function safeLookup(
  hostname: string,
  options: { family?: number | string; all?: boolean },
  callback: (
    error: NodeJS.ErrnoException | null,
    address: string | LookupAddress[],
    family?: number,
  ) => void,
) {
  const family = options.family === 4 || options.family === 6 ? options.family : 0;
  lookup(hostname, { all: true, family }, (error, addresses) => {
    if (error) return callback(error, "");
    if (!addresses.length || addresses.some((a) => isBlockedAddress(a.address))) {
      return callback(new Error(`${hostname} points to a private or reserved address`), "");
    }
    if (options.all) return callback(null, addresses);
    callback(null, addresses[0].address, addresses[0].family);
  });
}

/** Parses and vets a URL before any request: scheme, credentials, port and host. */
function vetUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new InputError("That doesn't look like a web address.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new InputError("Only http and https addresses can be checked.");
  }
  if (url.username || url.password)
    throw new InputError("Addresses with a login can't be checked.");
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new InputError("Only the standard web ports (80 and 443) can be checked.");
  }
  const host = url.hostname.replace(/\.$/, "").toLowerCase();
  if (net.isIP(host.replace(/^\[|\]$/g, ""))) {
    if (isBlockedAddress(host))
      throw new InputError("Private and internal addresses can't be checked.");
  } else if (
    !host.includes(".") ||
    /(^|\.)(localhost|local|internal|intranet|lan|home\.arpa|corp|test|invalid)$/.test(host)
  ) {
    throw new InputError("Enter a public website address, such as example.com.");
  }
  return url;
}

type Raw = {
  status: number;
  contentType: string;
  location?: string;
  body: string;
  truncated: boolean;
};

/** One GET with no redirects followed, a hard deadline and a byte cap (decompressed). */
function getOnce(url: URL, accept: string): Promise<Raw> {
  return new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : http;
    const request = client.request(
      url,
      {
        method: "GET",
        lookup: safeLookup as unknown as net.LookupFunction,
        headers: {
          "user-agent": USER_AGENT,
          accept,
          "accept-encoding": "gzip, deflate, br",
        },
      },
      (response) => {
        const encoding = String(response.headers["content-encoding"] ?? "").toLowerCase();
        const stream =
          encoding === "gzip"
            ? response.pipe(zlib.createGunzip())
            : encoding === "deflate"
              ? response.pipe(zlib.createInflate())
              : encoding === "br"
                ? response.pipe(zlib.createBrotliDecompress())
                : response;
        const chunks: Buffer[] = [];
        let size = 0;
        let truncated = false;
        const finish = () =>
          resolve({
            status: response.statusCode ?? 0,
            contentType: String(response.headers["content-type"] ?? "").toLowerCase(),
            location: response.headers.location,
            body: Buffer.concat(chunks).toString("utf8"),
            truncated,
          });
        stream.on("data", (chunk: Buffer) => {
          if (truncated) return;
          size += chunk.length;
          if (size > MAX_BYTES) {
            truncated = true;
            chunks.push(chunk.subarray(0, chunk.length - (size - MAX_BYTES)));
            response.destroy();
            finish();
            return;
          }
          chunks.push(chunk);
        });
        stream.on("end", finish);
        stream.on("error", (error) => (truncated ? finish() : reject(error)));
      },
    );
    const deadline = setTimeout(() => request.destroy(new Error("timed out")), TIMEOUT_MS);
    request.on("close", () => clearTimeout(deadline));
    request.on("error", reject);
    request.end();
  });
}

export type Fetched = Raw & { url: string; ms: number };

/**
 * A GET that vets the URL and every redirect hop. `accept` matters: some
 * sites answer a request that accepts markdown with markdown, or a 404.
 */
export async function safeGet(
  value: string,
  accept = "text/html,application/xhtml+xml",
): Promise<Fetched> {
  const started = Date.now();
  let url = vetUrl(value);
  for (let hop = 0; ; hop++) {
    const raw = await getOnce(url, accept);
    if (raw.status >= 300 && raw.status < 400 && raw.location) {
      if (hop >= MAX_REDIRECTS) throw new Error("too many redirects");
      url = vetUrl(new URL(raw.location, url).toString());
      continue;
    }
    return { ...raw, url: url.toString(), ms: Date.now() - started };
  }
}

// ---------- what the files say ----------

export type Status = "pass" | "warn" | "fail";
export type Check = { id: string; label: string; status: Status; detail: string; why: string };
export type Report = { site: string; checkedAt: string; checks: Check[] };

/** A fetch that failed outright keeps its reason, so the report can say why. */
type Got = Fetched | { error: string };
const got = (f: Got): f is Fetched => !("error" in f);
/** Refused, rate-limited, broken or unanswered: the file may exist, but this check couldn't read it. */
const unreadable = (f: Got) => !got(f) || [401, 403, 429].includes(f.status) || f.status >= 500;
const why = (f: Got) => (got(f) ? `status ${f.status}` : f.error);

const looksLikeHtml = (f: Fetched) =>
  f.contentType.includes("html") || /^\s*<(!doctype|html|head|body)\b/i.test(f.body);
/** A text file that really exists: a 200 that is not the site's HTML fallback page. */
const textFile = (f: Got) =>
  got(f) && f.status === 200 && f.body.trim() && !looksLikeHtml(f) ? f : null;

const count = (n: number) => n.toLocaleString("en-GB");
const kb = (text: string) => `${count(Math.max(1, Math.round(Buffer.byteLength(text) / 1024)))} KB`;
const plural = (n: number, word: string) => `${count(n)} ${word}${n === 1 ? "" : "s"}`;

/** The llmstxt.org shape: an H1 title, an optional > summary, ## sections of markdown links. */
export function readLlmsTxt(text: string) {
  const lines = text.split(/\r?\n/);
  const title = lines
    .find((l) => /^#\s+\S/.test(l))
    ?.replace(/^#\s+/, "")
    .trim();
  const summary = lines.some((l) => /^>\s*\S/.test(l));
  const sections = lines.filter((l) => /^##\s+\S/.test(l)).length;
  const links = (text.match(/\[[^\]\n]+\]\([^)\s]+\)/g) ?? []).length;
  return { title, summary, sections, links };
}

/** Well-known AI crawlers and assistants, by the user-agent token robots.txt rules use. */
export const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Meta-ExternalAgent",
];

type RobotsGroup = { agents: string[]; rules: { allow: boolean; path: string }[] };

export function readRobots(text: string) {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  let inRules = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    const match = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    if (key === "sitemap") {
      if (value) sitemaps.push(value);
    } else if (key === "user-agent") {
      if (!current || inRules) {
        current = { agents: [], rules: [] };
        groups.push(current);
        inRules = false;
      }
      current.agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && current) {
      inRules = true;
      current.rules.push({ allow: key === "allow", path: value });
    }
  }
  /** True when the agent may not fetch the home page at all. */
  const blocksSite = (agent: string) => {
    const token = agent.toLowerCase();
    const own = groups.filter((g) => g.agents.includes(token));
    const rules = (own.length ? own : groups.filter((g) => g.agents.includes("*"))).flatMap(
      (g) => g.rules,
    );
    const disallowAll = rules.some((r) => !r.allow && (r.path === "/" || r.path === "/*"));
    const allowRoot = rules.some((r) => r.allow && (r.path === "/" || r.path === "/$"));
    return disallowAll && !allowRoot;
  };
  return { sitemaps, blocked: AI_AGENTS.filter(blocksSite) };
}

export function readSitemap(xml: string) {
  const isIndex = /<sitemapindex[\s>]/i.test(xml);
  const valid = isIndex || /<urlset[\s>]/i.test(xml);
  return { valid, isIndex, entries: (xml.match(/<loc>/gi) ?? []).length };
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/** What the page says before any JavaScript runs. */
export function readHtml(html: string) {
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? html;
  const attr = (tag: string | undefined, name: string) =>
    tag?.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1]?.trim();
  const meta = (name: string) =>
    attr(
      head.match(new RegExp(`<meta[^>]+(?:name|property)\\s*=\\s*["']${name}["'][^>]*>`, "i"))?.[0],
      "content",
    );
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const types = new Set<string>();
  for (const block of html.matchAll(
    /<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const walk = (node: unknown): void => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (!node || typeof node !== "object") return;
        const record = node as Record<string, unknown>;
        const type = record["@type"];
        for (const t of Array.isArray(type) ? type : [type])
          if (typeof t === "string") types.add(t);
        if (record["@graph"]) walk(record["@graph"]);
      };
      walk(JSON.parse(block[1]));
    } catch {
      // A block that isn't valid JSON adds nothing.
    }
  }
  const text = html
    .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e: string) =>
      e[0] === "#"
        ? String.fromCodePoint(e[1] === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
        : (ENTITIES[e.toLowerCase()] ?? m),
    )
    .replace(/\s+/g, " ")
    .trim();
  return {
    words: text ? text.split(" ").length : 0,
    title,
    description: meta("description") ?? meta("og:description"),
    canonical: attr(head.match(/<link[^>]+rel\s*=\s*["']canonical["'][^>]*>/i)?.[0], "href"),
    lang: attr(html.match(/<html[^>]*>/i)?.[0], "lang"),
    h1: /<h1[\s>]/i.test(html),
    jsonLdTypes: [...types],
  };
}

// ---------- the check ----------

/** "example.com", "https://example.com/blog" or "http://example.com" becomes the site's origin. */
export function siteFrom(input: string): string {
  const value = input.trim();
  if (!value) throw new InputError("Enter a website address.");
  if (value.length > 300) throw new InputError("That address is too long.");
  return vetUrl(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`).origin;
}

const TEXT = "text/plain, text/markdown;q=0.9, */*;q=0.1";
const XML = "application/xml, text/xml;q=0.9, */*;q=0.1";
const settle = (p: Promise<Fetched>): Promise<Got> =>
  p.catch((error: Error) => ({
    error: error.message === "timed out" ? "it timed out" : "it couldn't be fetched",
  }));

export async function checkSite(input: string): Promise<Report> {
  const site = siteFrom(input);
  const [home, llms, full, robots] = await Promise.all([
    settle(safeGet(`${site}/`)),
    settle(safeGet(`${site}/llms.txt`, TEXT)),
    settle(safeGet(`${site}/llms-full.txt`, TEXT)),
    settle(safeGet(`${site}/robots.txt`, TEXT)),
  ]);
  if (!got(home)) {
    throw new InputError(
      `Couldn't reach ${new URL(site).hostname} (${home.error}). Check the address and try again.`,
    );
  }
  const robotsFile = textFile(robots);
  const robotsInfo = robotsFile ? readRobots(robotsFile.body) : null;
  const sitemapUrl = robotsInfo?.sitemaps[0] ?? `${site}/sitemap.xml`;
  const sitemap = await settle(safeGet(sitemapUrl, XML));
  const checks: Check[] = [];

  const llmsFile = textFile(llms);
  if (!llmsFile) {
    checks.push({
      id: "llms",
      label: "llms.txt",
      status: unreadable(llms) ? "warn" : "fail",
      detail: unreadable(llms)
        ? `Couldn't read /llms.txt (${why(llms)}). The site may block automated requests.`
        : "There's no llms.txt at /llms.txt.",
      why: "A short markdown index at a fixed address lets AI agents find your key pages without crawling the whole site.",
    });
  } else {
    const l = readLlmsTxt(llmsFile.body);
    const missing = [!l.title && "an H1 title", !l.links && "links"].filter(Boolean);
    checks.push({
      id: "llms",
      label: "llms.txt",
      status: missing.length ? "warn" : "pass",
      detail: missing.length
        ? `Found, but it has no ${missing.join(" or ")}, which the llmstxt.org format expects.`
        : `Found: "${l.title}", ${plural(l.sections, "section")} and ${plural(l.links, "link")}.`,
      why: "A short markdown index at a fixed address lets AI agents find your key pages without crawling the whole site.",
    });
  }

  const fullFile = textFile(full);
  checks.push({
    id: "llms-full",
    label: "llms-full.txt",
    status: fullFile ? "pass" : "warn",
    detail: fullFile
      ? `Found: ${kb(fullFile.body)}${fullFile.truncated ? " or more" : ""} of plain text.`
      : unreadable(full)
        ? `Couldn't read /llms-full.txt (${why(full)}). It's optional.`
        : "There's no llms-full.txt. It's optional.",
    why: "The whole site as one text file gives an agent everything in a single request.",
  });

  const page = home.status === 200 && looksLikeHtml(home) ? readHtml(home.body) : null;
  checks.push({
    id: "html",
    label: "Content without JavaScript",
    status: !page ? "fail" : page.words >= 150 ? "pass" : "fail",
    detail: !page
      ? unreadable(home)
        ? `The home page refused this check (status ${home.status}). Sites that block automated requests often treat AI crawlers the same way.`
        : `The home page answered with status ${home.status} instead of a page.`
      : page.words >= 150
        ? `The home page has ${page.words.toLocaleString("en-GB")} words in its HTML before any script runs.`
        : `The home page has only ${plural(page.words, "word")} before any script runs, so it's probably built in the browser.`,
    why: "Most AI crawlers read the raw HTML and don't run JavaScript, so content built in the browser is invisible to them.",
  });

  if (page) {
    const missing = [
      !page.title && "a title",
      !page.description && "a meta description",
      !page.h1 && "an h1",
      !page.canonical && "a canonical link",
      !page.lang && "a lang attribute",
    ].filter(Boolean) as string[];
    checks.push({
      id: "meta",
      label: "Title and description",
      status: !page.title || !page.description ? "fail" : missing.length ? "warn" : "pass",
      detail: missing.length
        ? `The home page is missing ${missing.join(", ").replace(/, ([^,]*)$/, " and $1")}.`
        : "The home page has a title, a description, an h1, a canonical link and its language.",
      why: "Titles and descriptions are what agents quote when they summarise or cite a page.",
    });
    checks.push({
      id: "jsonld",
      label: "Structured data",
      status: page.jsonLdTypes.length ? "pass" : "warn",
      detail: page.jsonLdTypes.length
        ? `JSON-LD on the home page: ${page.jsonLdTypes.slice(0, 6).join(", ")}.`
        : "There's no JSON-LD on the home page.",
      why: "Structured data says who and what a page is about in a form machines don't have to guess.",
    });
  }

  checks.push({
    id: "robots",
    label: "AI crawlers allowed",
    status: !robotsInfo ? "warn" : robotsInfo.blocked.length ? "warn" : "pass",
    detail: !robotsInfo
      ? unreadable(robots)
        ? `Couldn't read robots.txt (${why(robots)}), so this can't say which crawlers are allowed.`
        : "There's no robots.txt, so crawlers assume everything is allowed."
      : robotsInfo.blocked.length
        ? `robots.txt blocks ${robotsInfo.blocked.join(", ")} from the whole site.`
        : "robots.txt lets the main AI crawlers in (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others).",
    why: "AI answer engines can only cite pages their crawlers may read. Blocking them can be deliberate.",
  });

  const sitemapFile = got(sitemap) && sitemap.status === 200 ? readSitemap(sitemap.body) : null;
  checks.push({
    id: "sitemap",
    label: "Sitemap",
    status: sitemapFile?.valid ? "pass" : "warn",
    detail: sitemapFile?.valid
      ? sitemapFile.isIndex
        ? `Found a sitemap index listing ${plural(sitemapFile.entries, "sitemap")}.`
        : `Found a sitemap listing ${plural(sitemapFile.entries, "page")}.`
      : "No sitemap was found in robots.txt or at /sitemap.xml.",
    why: "A sitemap lists every page you want found, including ones nothing links to.",
  });

  return { site, checkedAt: new Date().toISOString(), checks };
}
