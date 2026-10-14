// Typed access to build-time data written by scripts/fetch-data.mjs.
// The JSON files are committed, so the site still builds when a fetch fails.
import githubJson from "@/data/generated/github.json";
import blogJson from "@/data/generated/blog.json";

export type RepoStats = {
  /** null for private repos or when the stats could not be fetched */
  stars: number | null;
  language: string | null;
  private: boolean;
  url: string;
};

type GithubFile = {
  /** YYYY-MM-DD, or null if data has never been fetched */
  fetchedAt: string | null;
  followers: number | null;
  repos: Record<string, RepoStats>;
};

// Plain annotations (not casts) so a shape change in the JSON fails typecheck.
const github: GithubFile = githubJson;

export const githubStats: Record<string, RepoStats> = github.repos;
export const githubFollowers: number | null = github.followers;
export const githubFetchedAt: string | null = github.fetchedAt;

const normalizeRepo = (repo: string) =>
  repo
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/(\.git)?\/*$/, "")
    .toLowerCase();

const statsByKey = new Map(
  Object.entries(githubStats).map(([repo, stats]) => [repo.toLowerCase(), stats]),
);

/**
 * True for a GitHub URL whose repo is private, so the page can leave out a
 * link that would 404. Once the repo is public, the next build shows it.
 */
export function isPrivateRepo(url: string): boolean {
  if (!/^https?:\/\/(www\.)?github\.com\//i.test(url)) return false;
  return statsByKey.get(normalizeRepo(url))?.private === true;
}

/** Star count for "owner/repo" (or a github.com URL); null if private or unknown. */
export function starsFor(repo: string): number | null {
  return statsByKey.get(normalizeRepo(repo))?.stars ?? null;
}

/** Live star counts only when they help: 100 or more, and never on a card that hides them. */
export const STAR_FLOOR = 100;
export function shownStars(project: { githubRepo?: string; hideStars?: boolean }): number | null {
  if (!project.githubRepo || project.hideStars) return null;
  const stars = starsFor(project.githubRepo);
  return stars !== null && stars >= STAR_FLOOR ? stars : null;
}

/** A post from the blog's RSS feed: date as YYYY-MM, newest first. */
export type BlogPost = { title: string; url: string; date: string };

type BlogFile = { fetchedAt: string | null; feed: string; posts: BlogPost[] };
const blog: BlogFile = blogJson;
export const blogPosts: BlogPost[] = blog.posts;
