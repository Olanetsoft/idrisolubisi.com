import { site } from "@/data/site";

/**
 * "Available now · London · UK Global Talent", shown once, in the hero, short
 * enough for one line on most phones; under 360px the last item wraps onto
 * a line of its own. "No sponsorship needed" lives in Contact.
 * The separators are drawn in CSS, so a wrap never leaves a stray dot.
 */
export function StatusLine() {
  return (
    <p className="status-label">
      <span className="live-dot" aria-hidden="true" />
      <span className="status-item">Available now</span>
      <span className="status-item">{site.location}</span>
      <span className="status-item">{site.status}</span>
    </p>
  );
}
