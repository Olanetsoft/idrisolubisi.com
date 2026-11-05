import Image from "next/image";
import { site } from "@/data/site";
import {
  KIND,
  eventName,
  isUpcoming,
  latestTalk,
  stagePhotos,
  talkCity,
  talks,
} from "@/data/talks";
import { featuredVideos } from "@/data/videos";
import { StageRow, VideoRow } from "./ListRows";
import { MoreToggle } from "./MoreToggle";
import { SectionLabel } from "./SectionLabel";
import { PhotoDialog } from "./PhotoDialog";
import { ThreeDoor } from "./ThreeDoor";
import { VideoDialog } from "./VideoDialog";

type Talk = (typeof talks)[number];

/** The talk videos show the first six; a button reveals the rest. */
const VIDEOS_SHOWN = 6;

/** The On stage list shows the most recent rows; a button reveals the rest. */
const STAGES_SHOWN = 10;

/** "Lagos, 2025": the kind unless the label or title already says it, the city unless the event names it, the year. */
function highlightMeta(t: Talk, label: string): string {
  const kind = KIND[t.kind];
  const said = `${label} ${t.title ?? ""}`.toLowerCase();
  const showKind = !said.includes(kind.split(" ").pop()!.toLowerCase());
  const city = talkCity(t);
  return [showKind ? kind : undefined, city, t.year].filter(Boolean).join(", ");
}

export function Talks() {
  // The Latest card is the newest talk that has happened, so it moves on by itself.
  const latest = latestTalk();
  const highlights = [
    ...(latest ? [{ talk: latest, label: "Latest" }] : []),
    ...talks.flatMap((t) => (t.highlight ? [{ talk: t, label: t.highlight }] : [])),
  ];
  const stages = talks.filter((t) => !t.highlight && t !== latest);
  return (
    <section className="section" id="talks" aria-labelledby="talks-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="talks">Talks and workshops</SectionLabel>
          <p className="lede">On stage and on camera.</p>
          <ThreeDoor stage="flipped-phone" href="#talks" label="Turn the phone over" hint="to flip">
            <g transform="rotate(14 22 22)">
              <rect x="13.5" y="4.5" width="17" height="35" rx="3.5" />
              <rect
                className="three-door-amber"
                x="17.5"
                y="13"
                width="9"
                height="18"
                rx="1.5"
                transform="rotate(9 22 22)"
              />
              <circle className="three-door-dot" cx="22" cy="8.5" r="1.2" />
            </g>
          </ThreeDoor>
        </div>
        <PhotoDialog photos={stagePhotos} />
        <div className="stage-photos">
          {stagePhotos.map((p, i) => (
            <figure
              key={p.src}
              className={i === 0 ? "stage-photo stage-photo--lead" : "stage-photo"}
            >
              <a className="stage-photo-link" href={p.src} data-photo={i}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes={
                    i === 0
                      ? "(max-width: 759px) calc(100vw - 32px), (max-width: 1023px) 62vw, 640px"
                      : "(max-width: 759px) 46vw, (max-width: 1023px) 31vw, 320px"
                  }
                  style={p.position ? { objectPosition: p.position } : undefined}
                />
              </a>
              <figcaption className="stage-tag">{p.tag}</figcaption>
            </figure>
          ))}
        </div>
        <VideoDialog />
        <ul className="highlights">
          {highlights.map(({ talk: t, label }) => (
            <li key={t.event} className="highlight">
              <p className="highlight-label">{label}</p>
              <p className="highlight-event">
                {t.href ? (
                  // The year tells the two Blockfest links apart for screen readers.
                  <a href={t.href}>
                    {eventName(t)}
                    <span className="sr-only"> {t.year}</span>
                  </a>
                ) : (
                  eventName(t)
                )}
              </p>
              {t.title && <p className="highlight-title">{t.title}</p>}
              <p className="highlight-meta">{highlightMeta(t, label)}</p>
              {t.note && <p className="highlight-note">{t.note}</p>}
            </li>
          ))}
        </ul>
        <ul className="videos" id="talk-videos">
          {featuredVideos.map((v, i) => (
            <VideoRow key={v.id} video={v} extra={i >= VIDEOS_SHOWN || undefined} />
          ))}
        </ul>
        <div className="more-actions">
          {featuredVideos.length > VIDEOS_SHOWN && (
            <MoreToggle listId="talk-videos" noun="talk videos" />
          )}
          <p className="more-link more-links">
            <a href={site.links.youtube}>All talks on YouTube</a>
            <a href={site.links.sessionize}>Speaker profile on Sessionize</a>
          </p>
        </div>
        <div className="stage-head">
          <h3 className="group-label">On stage</h3>
          <ThreeDoor
            stage="strung-years"
            href="#on-stage"
            label="Strung Years, a toy with one bead for each talk"
            hint="to spin"
          >
            <path d="M7 37C14 37 17 31 17 25C17 15 33 13 33 22C33 29 23 29 23 22C23 13 31 7 38 7" />
            <circle cx="11" cy="36.2" r="2.2" fill="var(--bg)" />
            <circle cx="15.5" cy="31.7" r="2.2" fill="var(--bg)" />
            <circle cx="17" cy="25.4" r="2.2" fill="var(--bg)" />
            <circle className="three-door-dot" cx="24.8" cy="16.4" r="2.4" />
          </ThreeDoor>
        </div>
        <ul className="row-list stage-list" id="on-stage">
          {stages.map((t, i) => {
            const city = talkCity(t);
            const kind = [KIND[t.kind], city, isUpcoming(t) && "upcoming"].filter(Boolean);
            // Shown: an upcoming event drops its city, so the name keeps one line
            // on wide screens; screen readers still hear it.
            const shownKind = [KIND[t.kind], isUpcoming(t) ? "upcoming" : city].filter(Boolean);
            return (
              <StageRow
                key={`${t.event}-${t.title ?? t.kind}`}
                year={t.year}
                event={eventName(t)}
                href={t.href}
                kind={shownKind.join(" · ")}
                heard={t.href ? [...kind, t.year].join(", ") : undefined}
                extra={i >= STAGES_SHOWN || undefined}
              />
            );
          })}
        </ul>
        {stages.length > STAGES_SHOWN && (
          <div className="more-actions">
            <MoreToggle listId="on-stage" noun="events" />
          </div>
        )}
      </div>
    </section>
  );
}
