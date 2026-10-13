import Image from "next/image";
import { site } from "@/data/site";
import { talks } from "@/data/talks";
import { videos, type Video } from "@/lib/generated";

const SERIES = "Midnight for Developers";

/** Label each recording from its title: an episode of the series, a workshop, or a talk. */
function kindOf(video: Video): string {
  if (video.title.startsWith(`${SERIES}:`)) return "Series";
  if (/workshop|kickoff|onboarding|intro to/i.test(video.title)) return "Workshop";
  return "Talk";
}

/**
 * Drop the series prefix (the label already says it) and any YouTube-style
 * subtitle after a spaced "|" or "-", so a title reads cleanly and is never
 * cut off at a dangling separator.
 */
function titleOf(video: Video): string {
  const title = video.title.startsWith(`${SERIES}:`)
    ? video.title.slice(SERIES.length + 1).trim()
    : video.title;
  return title.split(/\s+[|\u2013-]\s+/)[0];
}

const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** "Devcon 2024", "Blockfest Africa 2025 (keynote)", for the on-stage row. */
function stageName(t: (typeof talks)[number]): string {
  const event = t.event.replace(/\s*\(.*\)$/, "");
  const name = !t.year || event.includes(t.year) ? event : `${event} ${t.year}`;
  const format: Partial<Record<(typeof talks)[number]["kind"], string>> = {
    Keynote: "keynote",
    "Fireside chat": "fireside chat",
    Host: "host",
    Workshop: "workshop",
  };
  return format[t.kind] ? `${name} (${format[t.kind]})` : name;
}

export function Talks() {
  const recent = videos.slice(0, 6);
  return (
    <section className="section" id="talks" aria-labelledby="talks-title">
      <div className="container">
        <div className="section-head">
          <h2 className="label" id="talks-title">
            <span className="label-index" aria-hidden="true" />
            Talks and workshops
          </h2>
          <p className="lede">Recorded workshops, talks and live builds.</p>
          <p className="lede-sub">
            Recordings on <a href={site.links.youtube}>YouTube</a>, including the ‘{SERIES}’ series.
          </p>
        </div>
        <div className="stages">
          <p className="stages-label" id="stages-label">
            On stage at
          </p>
          <ul className="stage-list" aria-labelledby="stages-label">
            {talks.map((t) => (
              <li key={`${t.event}-${t.title ?? t.kind}`} className="stage">
                {t.href ? <a href={t.href}>{stageName(t)}</a> : stageName(t)}
              </li>
            ))}
          </ul>
        </div>
        {recent.length > 0 && (
          <ul className="videos">
            {recent.map((v) => (
              <li key={v.id} className="video">
                <a className="video-link" href={v.url}>
                  <span className="video-thumb">
                    <Image
                      src={v.thumbnail}
                      alt=""
                      width={480}
                      height={360}
                      sizes="(max-width: 759px) 128px, (max-width: 1023px) 45vw, 336px"
                    />
                  </span>
                  <span className="video-text">
                    <span className="video-title">{titleOf(v)}</span>
                    <span className="video-meta">
                      {kindOf(v)}
                      {v.published && (
                        <>
                          {" "}
                          <span aria-hidden="true">·</span>{" "}
                          {date.format(new Date(v.published))}
                        </>
                      )}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="more-link">
          <a href={site.links.youtube}>All videos on YouTube</a>
        </p>
      </div>
    </section>
  );
}
