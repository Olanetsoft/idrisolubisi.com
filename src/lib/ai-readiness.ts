import { lookup, type LookupAddress } from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { pipeline } from "node:stream";
import zlib from "node:zlib";

/**
 * The AI readiness check behind /tools/ai-readiness (served by the Netlify
 * function netlify/functions/ai-check.mts). For the page someone names, it
 * reads that page, the site's llms.txt and llms-full.txt, robots.txt and a
 * sitemap, and says what an AI agent or crawler would find.
 *
 * Fetching addresses visitors type is the dangerous part, so every request
 * goes through safeGet: http or https on the default ports only, no
 * credentials, every DNS answer and every redirect checked against private
 * and internal ranges before connecting, a deadline per request and for the
 * whole check, and a size cap applied after decompression. The readers below
 * use only patterns that run in linear time, since the text they read comes
 * from whoever owns the site. Nothing is stored. No other module of the site
 * imports this file.
 */

/** One request, redirects included. */
const HOP_MS = 8000;
/** The whole check: every request has finished or been dropped by then. */
const BUDGET_MS = 15000;
/** Per response, after decompression. */
const MAX_BYTES = 1_500_000;
/** How much of a page's HTML the head and script checks read (words use all of it). */
const PARSE_CHARS = 512_000;
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
    // Public addresses all sit in 2000::/3, so anything else is refused. Inside
    // it, Teredo, 6to4 and documentation ranges can carry or stand for an
    // internal address, so they are refused too.
    if (!/^[23][0-9a-f]{0,3}:/.test(ip)) return true;
    return /^(2001::|2001:0:|2001:db8:|2002:|3fff:)/.test(ip);
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

/**
 * One GET, no redirects followed. It settles by `deadline` whatever the server
 * does: a response cut off mid-body (compressed or not) rejects, and a body
 * over the cap is cut, with the decompressor stopped there too. A redirect's
 * body is never read. Text is decoded as UTF-8 with any byte order mark dropped.
 */
function getOnce(url: URL, accept: string, deadline: number): Promise<Raw> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const client = url.protocol === "https:" ? https : http;
    const request = client.request(
      url,
      {
        method: "GET",
        lookup: safeLookup as unknown as net.LookupFunction,
        headers: { "user-agent": USER_AGENT, accept, "accept-encoding": "gzip, deflate" },
      },
      (response) => {
        const head = {
          status: response.statusCode ?? 0,
          contentType: String(response.headers["content-type"] ?? "").toLowerCase(),
          location: response.headers.location,
        };
        if (head.status >= 300 && head.status < 400 && head.location) {
          response.destroy();
          return done({ ...head, body: "", truncated: false });
        }
        const encoding = String(response.headers["content-encoding"] ?? "").toLowerCase();
        const decoder =
          encoding === "gzip"
            ? zlib.createGunzip()
            : encoding === "deflate"
              ? zlib.createInflate()
              : null;
        // pipeline hands a cut-off response on to the decoder as an error, so
        // the read always ends one way or the other.
        const stream = decoder ? pipeline(response, decoder, () => {}) : response;
        const chunks: Buffer[] = [];
        let size = 0;
        const finish = (truncated: boolean) =>
          done({
            ...head,
            body: new TextDecoder("utf-8").decode(Buffer.concat(chunks)),
            truncated,
          });
        stream.on("data", (chunk: Buffer) => {
          if (settled) return;
          const room = MAX_BYTES - size;
          if (chunk.length >= room) {
            chunks.push(chunk.subarray(0, room));
            size = MAX_BYTES;
            response.destroy();
            decoder?.destroy();
            return finish(true);
          }
          size += chunk.length;
          chunks.push(chunk);
        });
        stream.on("end", () => finish(false));
        stream.on("error", fail);
        if (!decoder) {
          response.on("close", () => {
            if (!response.complete) fail(new Error("the response was cut off"));
          });
        }
      },
    );
    const timer = setTimeout(
      () => fail(new Error("timed out")),
      Math.max(0, deadline - Date.now()),
    );
    function done(raw: Raw) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(raw);
    }
    function fail(error: Error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      request.destroy();
      reject(error);
    }
    request.on("error", fail);
    request.end();
  });
}

export type Fetched = Raw & { url: string };

const HTML = "text/html,application/xhtml+xml";
const TEXT = "text/plain, text/markdown;q=0.9, */*;q=0.1";
/** robots.txt is asked for the way crawlers ask, without markdown. */
const ROBOTS = "text/plain, */*;q=0.1";
const XML = "application/xml, text/xml;q=0.9, */*;q=0.1";

/**
 * A GET that vets the URL and every redirect hop, within `deadline`. `accept`
 * matters: some sites answer a request that accepts markdown with markdown,
 * or a 404 (react.dev does, even for robots.txt).
 */
export async function safeGet(
  value: string,
  accept = HTML,
  deadline = Date.now() + HOP_MS,
): Promise<Fetched> {
  let url = vetUrl(value);
  for (let hop = 0; ; hop++) {
    if (Date.now() >= deadline) throw new Error("timed out");
    const raw = await getOnce(url, accept, Math.min(deadline, Date.now() + HOP_MS));
    if (raw.status >= 300 && raw.status < 400 && raw.location) {
      if (hop >= MAX_REDIRECTS) throw new Error("too many redirects");
      url = vetUrl(new URL(raw.location, url).toString());
      continue;
    }
    return { ...raw, url: url.toString() };
  }
}

// ---------- what the files say ----------

export type Status = "pass" | "warn" | "fail";
export type Check = { id: string; label: string; status: Status; detail: string; why: string };
export type Report = { site: string; page: string; checkedAt: string; checks: Check[] };

/** A fetch that failed outright keeps its reason, so the report can say why. */
type Got = Fetched | { error: string };
const got = (f: Got): f is Fetched => !("error" in f);
/**
 * A bot check served with a 200 in place of the page (Amazon's captcha,
 * Reddit's JavaScript challenge). It says nothing about the site, so it counts
 * as a refusal. Only markers of the check pages themselves, never a script
 * that real pages load too.
 */
const challenged = (f: Got) =>
  got(f) &&
  f.status === 200 &&
  f.body.length < 100_000 &&
  /\/errors_page\/validateCaptcha|\bname\s*=\s*["']?js_challenge\b/i.test(f.body);
/**
 * Refused, rate-limited, challenged, broken or unanswered: the file may exist,
 * but this check couldn't read it. A 202 is AWS WAF's bot check (IMDb's,
 * Booking's), whose body may be empty.
 */
const unreadable = (f: Got) =>
  !got(f) || [202, 401, 403, 429].includes(f.status) || f.status >= 500 || challenged(f);
const why = (f: Got) =>
  !got(f) ? f.error : challenged(f) ? "it answered with a bot check" : `status ${f.status}`;

const startsLikeHtml = (body: string) => /^\s*<(!doctype|html|head|body)\b/i.test(body);
const looksLikeHtml = (f: Fetched) => f.contentType.includes("html") || startsLikeHtml(f.body);
/**
 * A text file that really exists: a 200 whose body is not the site's HTML
 * fallback page. Judged by the body, since some servers label plain text as
 * HTML.
 */
const textFile = (f: Got) =>
  got(f) && f.status === 200 && f.body.trim() && !startsLikeHtml(f.body) ? f : null;

const count = (n: number) => n.toLocaleString("en-GB");
const kb = (text: string) => `${count(Math.max(1, Math.round(Buffer.byteLength(text) / 1024)))} KB`;
const plural = (n: number, word: string) => `${count(n)} ${word}${n === 1 ? "" : "s"}`;
/** "a, b and c". */
const list = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

/** The llmstxt.org shape: an H1 title, an optional > summary, ## sections of markdown links. */
export function readLlmsTxt(text: string) {
  const lines = text.split(/\r?\n/);
  const title = lines
    .find((l) => /^#\s+\S/.test(l))
    ?.replace(/^#\s+/, "")
    .trim();
  const summary = lines.some((l) => /^>\s*\S/.test(l));
  const sections = lines.filter((l) => /^##\s+\S/.test(l)).length;
  const links = (text.match(/\[[^[\]\n]+\]\([^()\s]+\)/g) ?? []).length;
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

/**
 * robots.txt groups, the sitemaps it lists, and which AI agents may not read
 * the site root: `blocked` from the whole site, `partly` from all but some
 * sections it allows.
 */
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
  const verdict = (agent: string) => {
    const token = agent.toLowerCase();
    const own = groups.filter((g) => g.agents.includes(token));
    const rules = (own.length ? own : groups.filter((g) => g.agents.includes("*"))).flatMap(
      (g) => g.rules,
    );
    const disallowAll = rules.some((r) => !r.allow && (r.path === "/" || r.path === "/*"));
    const allowRoot = rules.some((r) => r.allow && (r.path === "/" || r.path === "/$"));
    if (!disallowAll || allowRoot) return "allowed";
    return rules.some((r) => r.allow && r.path && r.path !== "/" && r.path !== "/$")
      ? "partly"
      : "blocked";
  };
  return {
    sitemaps,
    blocked: AI_AGENTS.filter((a) => verdict(a) === "blocked"),
    partly: AI_AGENTS.filter((a) => verdict(a) === "partly"),
  };
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

/** An entity as text; a code point out of range becomes the replacement character. */
function entity(match: string, name: string): string {
  if (name[0] !== "#") return ENTITIES[name.toLowerCase()] ?? match;
  const n = /^#x/i.test(name) ? parseInt(name.slice(2), 16) : Number(name.slice(1));
  return Number.isInteger(n) && n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "�";
}

/** Every opening tag of one kind, attributes included. */
const tagsOf = (html: string, name: string) =>
  html.match(new RegExp(`<${name}\\b[^<>]*>`, "gi")) ?? [];

/**
 * One attribute's value from one tag: double-quoted, single-quoted or bare.
 * The name must begin the attribute, so data-lang does not count as lang.
 */
function attr(tag: string | undefined, name: string): string | undefined {
  const m = tag?.match(
    new RegExp(`[\\s"'/]${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>\`]+))`, "i"),
  );
  return (m?.[1] ?? m?.[2] ?? m?.[3])?.trim();
}

/** Scripts that write words without spaces between them; counted with Intl.Segmenter. */
const UNSPACED =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}]/u;

function countWords(text: string): number {
  if (!text) return 0;
  if (!UNSPACED.test(text)) return text.split(" ").length;
  let words = 0;
  for (const s of new Intl.Segmenter(undefined, { granularity: "word" }).segment(
    text.slice(0, 200_000),
  )) {
    if (s.isWordLike) words++;
  }
  return words;
}

/**
 * What a page says before any JavaScript runs. The words and the h1 come from
 * all of the HTML that was fetched, since a page can spend its first 512 K
 * characters on inline CSS (the Guardian's does); the head and the scripts
 * from the first 512 K.
 */
export function readHtml(source: string) {
  const html = source.slice(0, PARSE_CHARS);
  // Each lazy scan ends at its closing tag or at the end of the text, so an
  // unclosed tag is read once instead of once per opener.
  const head = html.match(/<head\b[\s\S]*?(?:<\/head\s*>|$)/i)?.[0] ?? html;
  const metas = tagsOf(head, "meta");
  const meta = (key: string) => {
    for (const tag of metas) {
      if ((attr(tag, "name") ?? attr(tag, "property"))?.toLowerCase() === key) {
        return attr(tag, "content");
      }
    }
  };
  const title = head.match(/<title\b[^<>]*>([\s\S]*?)(?:<\/title\s*>|$)/i)?.[1]?.trim();
  const canonical = tagsOf(head, "link").find((tag) =>
    /(^|\s)canonical(\s|$)/i.test(attr(tag, "rel") ?? ""),
  );
  const types = new Set<string>();
  let scripts = 0;
  let modules = 0;
  let bundles = 0;
  for (const [, attrs, body] of html.matchAll(
    /<script\b([^<>]*)>([\s\S]*?)(?:<\/script\s*>|$)/gi,
  )) {
    const type = (attr(`<script ${attrs}>`, "type") ?? "").toLowerCase();
    if (type === "application/ld+json") {
      try {
        const walk = (node: unknown): void => {
          if (Array.isArray(node)) return node.forEach(walk);
          if (!node || typeof node !== "object") return;
          const record = node as Record<string, unknown>;
          const t = record["@type"];
          for (const one of Array.isArray(t) ? t : [t]) if (typeof one === "string") types.add(one);
          if (record["@graph"]) walk(record["@graph"]);
        };
        walk(JSON.parse(body));
      } catch {
        // A block that isn't valid JSON adds nothing.
      }
    } else if (!type || type === "module" || /javascript|ecmascript/.test(type)) {
      scripts++;
      if (type === "module") modules++;
      if (attr(`<script ${attrs}>`, "src")) bundles++;
    }
  }
  // Signs that the page is built in the browser: an empty app container, or
  // a <noscript> asking for JavaScript. Empty divs are found first and their
  // id tested after, so a long tag is scanned once.
  const appShell =
    [...html.matchAll(/<div\b[^<>]*>\s*<\/div>/gi)].some(([tag]) =>
      /\sid\s*=\s*["']?(root|app|__next|__nuxt|svelte)\b/i.test(tag),
    ) ||
    /<app-root\b/i.test(html) ||
    [...html.matchAll(/<noscript\b[^<>]*>([\s\S]*?)(?:<\/noscript\s*>|$)/gi)].some(([, inner]) =>
      /javascript/i.test(inner),
    );
  // The markup a reader sees: no scripts, styles, templates or comments,
  // whose markup is never shown (an <h1> in a script string isn't a heading).
  const shown = source
    .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?(?:<\/\1\s*>|$)/gi, " ")
    .replace(/<!--[\s\S]*?(?:-->|$)/g, " ");
  const text = shown
    .replace(/<[^<>]*>/g, " ")
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, entity)
    .replace(/\s+/g, " ")
    .trim();
  return {
    words: countWords(text),
    scripts,
    // Built in the browser, on the evidence: an empty app container, a module
    // script, or several script bundles (a page with jQuery alone is not).
    builtInBrowser: appShell || modules > 0 || bundles >= 3,
    title,
    description: meta("description") ?? meta("og:description"),
    canonical: attr(canonical, "href"),
    lang: attr(tagsOf(html, "html")[0], "lang"),
    h1: /<h1[\s>]/i.test(shown),
    jsonLdTypes: [...types],
  };
}

// ---------- the check ----------

/**
 * What to check for what someone typed: the site's origin (robots.txt and the
 * sitemap live there) and the page itself, path kept, query and hash dropped.
 */
export function targetFrom(input: string): { site: string; page: string } {
  const value = input.trim();
  if (!value) throw new InputError("Enter a website address.");
  if (value.length > 300) throw new InputError("That address is too long.");
  const url = vetUrl(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`);
  return { site: url.origin, page: `${url.origin}${url.pathname || "/"}` };
}

/** "/docs/intro.html" lives in "/docs/"; "/pdf.js" is read as the folder "/pdf.js/". */
const folderOf = (pathname: string) =>
  pathname.endsWith("/")
    ? pathname
    : /\.[a-z0-9]+$/i.test(pathname.split("/").pop() ?? "")
      ? pathname.slice(0, pathname.lastIndexOf("/") + 1)
      : `${pathname}/`;

/** A listed sitemap is followed only on the same site (www or not, or a subdomain of it). */
const sameSite = (url: string, site: string) => {
  try {
    const base = (h: string) => h.replace(/^www\./, "");
    const host = base(new URL(url).hostname);
    const own = base(new URL(site).hostname);
    return host === own || host.endsWith(`.${own}`);
  } catch {
    return false;
  }
};

export async function checkSite(input: string): Promise<Report> {
  const { site, page } = targetFrom(input);
  const deadline = Date.now() + BUDGET_MS;
  const settle = (value: string, accept: string): Promise<Got> =>
    safeGet(value, accept, deadline).catch((error: Error) => ({
      error: error.message === "timed out" ? "it timed out" : "it couldn't be fetched",
    }));
  // The root's llms files start at once, alongside the page.
  const rootLlms = settle(`${site}/llms.txt`, TEXT);
  const rootFull = settle(`${site}/llms-full.txt`, TEXT);
  const [home, robots, defaultSitemap] = await Promise.all([
    settle(page, HTML),
    settle(`${site}/robots.txt`, ROBOTS),
    settle(`${site}/sitemap.xml`, XML),
  ]);
  if (!got(home)) {
    throw new InputError(
      `Couldn't reach ${new URL(site).hostname} (${home.error}). Check the address and try again.`,
    );
  }
  // llms.txt may also sit in the page's folder (a GitHub Pages project site
  // can't write to the domain root). The folder is read from the page's final
  // address, since /pdf.js redirects to /pdf.js/; its copy wins over the root's.
  const folder = folderOf(new URL(home.url).pathname);
  const llmsAt = folder === "/" ? ["/"] : [folder, "/"];
  const inFolder =
    folder === "/"
      ? []
      : await Promise.all([
          settle(`${site}${folder}llms.txt`, TEXT),
          settle(`${site}${folder}llms-full.txt`, TEXT),
        ]);
  const [llmsRoot, fullRoot] = await Promise.all([rootLlms, rootFull]);
  const files = [...inFolder, llmsRoot, fullRoot];
  const robotsFile = textFile(robots);
  const robotsInfo = robotsFile ? readRobots(robotsFile.body) : null;
  // The sitemaps robots.txt lists (up to two, on this site), then /sitemap.xml.
  const listed = [
    ...new Set(
      (robotsInfo?.sitemaps ?? [])
        .map((v) => {
          try {
            return new URL(v, robotsFile!.url).toString();
          } catch {
            return "";
          }
        })
        .filter((u) => u && sameSite(u, site) && u !== `${site}/sitemap.xml`),
    ),
  ].slice(0, 2);
  const listedSitemaps = await Promise.all(listed.map((u) => settle(u, XML)));
  const sitemapTries = [
    ...listed.map((url, i) => ({ url, got: listedSitemaps[i] })),
    { url: `${site}/sitemap.xml`, got: defaultSitemap },
  ];

  const where = new URL(page).pathname === "/" ? "The home page" : "The page";
  const checks: Check[] = [];

  // llms.txt and llms-full.txt: the folder's copy wins over the root's.
  const pick = (offset: number) => {
    for (let i = 0; i < llmsAt.length; i++) {
      const file = textFile(files[i * 2 + offset]);
      if (file) return { file, at: llmsAt[i] };
    }
    return { file: null, at: "/" };
  };
  const llms = pick(0);
  const full = pick(1);
  const llmsWhy =
    "A short markdown index at a fixed address lets AI agents find your key pages without crawling the whole site.";
  if (!llms.file) {
    const tried = llmsRoot;
    checks.push({
      id: "llms",
      label: "llms.txt",
      status: unreadable(tried) ? "warn" : "fail",
      detail: unreadable(tried)
        ? `Couldn't read /llms.txt (${why(tried)}). The site may block automated requests.`
        : `There's no llms.txt at ${list(llmsAt.map((at) => `${at}llms.txt`)).replace(" and ", " or ")}.`,
      why: llmsWhy,
    });
  } else {
    const l = readLlmsTxt(llms.file.body);
    const missing = [!l.title && "H1 title", !l.links && "links"].filter(Boolean) as string[];
    const at = llms.at === "/" ? "" : ` at ${llms.at}llms.txt`;
    checks.push({
      id: "llms",
      label: "llms.txt",
      status: missing.length ? "warn" : "pass",
      detail: missing.length
        ? `Found${at}, but it has no ${missing.join(" or ")}, which the llmstxt.org format expects.`
        : `Found${at}: "${l.title}", ${plural(l.sections, "section")} and ${plural(l.links, "link")}.`,
      why: llmsWhy,
    });
  }

  checks.push({
    id: "llms-full",
    label: "llms-full.txt",
    status: full.file ? "pass" : "warn",
    detail: full.file
      ? `Found${full.at === "/" ? "" : ` at ${full.at}llms-full.txt`}: ${kb(full.file.body)}${full.file.truncated ? " or more" : ""} of plain text.`
      : unreadable(fullRoot)
        ? `Couldn't read /llms-full.txt (${why(fullRoot)}). It's optional.`
        : "There's no llms-full.txt. It's optional.",
    why: "The whole site as one text file gives an agent everything in a single request.",
  });

  let read: ReturnType<typeof readHtml> | null = null;
  if (home.status === 200 && looksLikeHtml(home) && !challenged(home)) {
    try {
      read = readHtml(home.body);
    } catch {
      read = null;
    }
  }
  const htmlWhy =
    "Most AI crawlers read the raw HTML and don't run JavaScript, so content built in the browser is invisible to them.";
  if (!read) {
    checks.push({
      id: "html",
      label: "Content without JavaScript",
      status: unreadable(home) ? "warn" : "fail",
      detail: unreadable(home)
        ? `Couldn't read ${where.toLowerCase()} (${why(home)}). The site may block automated requests, so this can't say what's in its HTML.`
        : `${where} answered with status ${home.status} instead of an HTML page.`,
      why: htmlWhy,
    });
  } else {
    const built = read.builtInBrowser;
    checks.push({
      id: "html",
      label: "Content without JavaScript",
      status: read.words >= 150 ? "pass" : built && !home.truncated ? "fail" : "warn",
      detail:
        read.words >= 150
          ? `${where} has ${home.truncated ? "at least " : ""}${plural(read.words, "word")} in its HTML before any script runs.`
          : home.truncated
            ? `${where} is over ${MAX_BYTES / 1_000_000} MB, and its first ${MAX_BYTES / 1_000_000} MB has only ${plural(read.words, "word")} before any script runs.`
            : built
              ? `${where} has only ${plural(read.words, "word")} before any script runs, and looks built in the browser.`
              : `${where} has only ${plural(read.words, "word")} of text in its HTML.`,
      why: htmlWhy,
    });
  }

  const metaWhy =
    "Titles and descriptions are what agents quote when they summarise or cite a page.";
  const jsonWhy =
    "Structured data says who and what a page is about in a form machines don't have to guess.";
  if (read) {
    const missing = [
      !read.title && "a title",
      !read.description && "a meta description",
      // An h1 past the cut of a page over the size cap would be missed.
      !read.h1 && !home.truncated && "an h1",
      !read.canonical && "a canonical link",
      !read.lang && "a lang attribute",
    ].filter(Boolean) as string[];
    checks.push({
      id: "meta",
      label: "Title and description",
      status: !read.title || !read.description ? "fail" : missing.length ? "warn" : "pass",
      detail: missing.length
        ? `${where} is missing ${list(missing)}.`
        : `${where} has a title, a description, an h1, a canonical link and its language.`,
      why: metaWhy,
    });
    checks.push({
      id: "jsonld",
      label: "Structured data",
      status: read.jsonLdTypes.length ? "pass" : "warn",
      detail: read.jsonLdTypes.length
        ? `JSON-LD on ${where.toLowerCase()}: ${read.jsonLdTypes.slice(0, 6).join(", ")}.`
        : `There's no JSON-LD on ${where.toLowerCase()}.`,
      why: jsonWhy,
    });
  } else {
    const unchecked = `Couldn't be checked without ${where.toLowerCase()}'s HTML.`;
    checks.push({
      id: "meta",
      label: "Title and description",
      status: "warn",
      detail: unchecked,
      why: metaWhy,
    });
    checks.push({
      id: "jsonld",
      label: "Structured data",
      status: "warn",
      detail: unchecked,
      why: jsonWhy,
    });
  }

  const blocked = robotsInfo?.blocked ?? [];
  const partly = robotsInfo?.partly ?? [];
  checks.push({
    id: "robots",
    label: "AI crawlers allowed",
    status: !robotsInfo
      ? unreadable(robots)
        ? "warn"
        : "pass"
      : blocked.length || partly.length
        ? "warn"
        : "pass",
    detail: !robotsInfo
      ? unreadable(robots)
        ? `Couldn't read robots.txt (${why(robots)}), so this can't say which crawlers are allowed.`
        : "There's no robots.txt, so crawlers assume everything is allowed."
      : blocked.length || partly.length
        ? [
            blocked.length && `robots.txt blocks ${list(blocked)} from the whole site`,
            partly.length &&
              `${blocked.length ? "and" : "robots.txt blocks"} ${list(partly)} from all but a few sections it allows`,
          ]
            .filter(Boolean)
            .join(", ") + "."
        : "robots.txt lets the main AI crawlers in (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others).",
    why: "AI answer engines can only cite pages their crawlers may read. Blocking them can be deliberate.",
  });

  // The first sitemap that answers as one wins; a gzipped one is taken on trust.
  let found: { entries: number; isIndex: boolean; cut: boolean } | null = null;
  for (const { url, got: g } of sitemapTries) {
    if (!got(g) || g.status !== 200 || startsLikeHtml(g.body)) continue;
    if (/\.gz(\?|$)/i.test(url)) {
      found = { entries: -1, isIndex: false, cut: false };
      break;
    }
    const s = readSitemap(g.body);
    if (s.valid) {
      found = { entries: s.entries, isIndex: s.isIndex, cut: g.truncated };
      break;
    }
  }
  const sitemapBlocked = sitemapTries.find((t) => unreadable(t.got));
  checks.push({
    id: "sitemap",
    label: "Sitemap",
    status: found ? "pass" : "warn",
    detail: found
      ? found.entries < 0
        ? "Found a gzipped sitemap."
        : `Found a sitemap ${found.isIndex ? "index " : ""}listing ${found.cut ? "at least " : ""}${plural(found.entries, found.isIndex ? "sitemap" : "page")}.`
      : sitemapBlocked
        ? `Couldn't read the sitemap (${why(sitemapBlocked.got)}).`
        : listed.length
          ? "robots.txt lists a sitemap, but it couldn't be read as one, and there's none at /sitemap.xml."
          : "No sitemap was found in robots.txt or at /sitemap.xml.",
    why: "A sitemap lists every page you want found, including ones nothing links to.",
  });

  return { site, page, checkedAt: new Date().toISOString(), checks };
}
