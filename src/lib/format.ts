import { site } from "@/data/site";

/** A site path ("/work/swoopagent") as a full URL, for files read off the site; other URLs pass through. */
export function absoluteUrl(url: string): string {
  return url.startsWith("/") ? `${site.url}${url}` : url;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2022-01" (or "2026-10-14") becomes "Jan 2022", the same month style as the experience dates. */
export function monthYear(date: string): string {
  const [year, month] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}
