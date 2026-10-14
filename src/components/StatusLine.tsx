import { site } from "@/data/site";

/**
 * "Available now · London · UK Global Talent · No sponsorship needed". Shown
 * once, in the hero. The separators
 * are drawn in CSS, so on a phone the last item drops to its own line without
 * leaving a stray dot at the end of the first.
 */
export function StatusLine() {
  return (
    <p className="status-label">
      <span className="live-dot" aria-hidden="true" />
      <span className="status-item">Available now</span>
      <span className="status-item">{site.location}</span>
      <span className="status-item">{site.status}</span>
      <span className="status-item">No sponsorship needed</span>
    </p>
  );
}
