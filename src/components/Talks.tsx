import Image from "next/image";
import { site } from "@/data/site";
import { isUpcoming, latestTalk, stagePhotos, talks } from "@/data/talks";
import { featuredVideos } from "@/data/videos";
import { MoreToggle } from "./MoreToggle";
import { SectionLabel } from "./SectionLabel";
import { PhotoDialog } from "./PhotoDialog";
import { VideoDialog } from "./VideoDialog";

type Talk = (typeof talks)[number];

/** The talk videos show the first six; a button reveals the rest. */
const VIDEOS_SHOWN = 6;

/** The On stage list shows the most recent rows; a button reveals the rest. */
const STAGES_SHOWN = 10;

const KIND: Record<Talk["kind"], string> = {
  Keynote: "Keynote",
  Talk: "Talk",
  Workshop: "Workshop",
  Panel: "Panel",
  "Fireside chat": "Fireside chat",
  Host: "Host",
  Lecture: "Guest lecture",
  Speaker: "Speaker",
};

/** "Blockfest Africa", without a trailing year or a bracketed long name; the year has its own column. */
function eventName(t: Talk): string {
  return t.event.replace(/\s*\(.*\)$/, "").replace(/\s+\d{4}$/, "");
}

/** "Lagos, 2025": the kind unless the label or title already says it, the city unless the event names it, the year. */
function highlightMeta(t: Talk, label: string): string {
  const kind = KIND[t.kind];
  const said = `${label} ${t.title ?? ""}`.toLowerCase();
  const showKind = !said.includes(kind.split(" ").pop()!.toLowerCase());
  const city = t.location && !eventName(t).includes(t.location) ? t.location : undefined;
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
                {t.href ? <a href={t.href}>{eventName(t)}</a> : eventName(t)}
              </p>
              {t.title && <p className="highlight-title">{t.title}</p>}
              <p className="highlight-meta">{highlightMeta(t, label)}</p>
              {t.note && <p className="highlight-note">{t.note}</p>}
            </li>
          ))}
        </ul>
        <ul className="videos" id="talk-videos">
          {featuredVideos.map((v, i) => (
            <li key={v.id} className="video" data-extra={i >= VIDEOS_SHOWN || undefined}>
              <a
                className="video-link"
                href={`https://www.youtube.com/watch?v=${v.id}${v.start ? `&t=${v.start}s` : ""}`}
                data-video-id={v.id}
                data-video-start={v.start}
                data-video-title={v.title}
              >
                <span className="video-thumb">
                  <Image
                    src={`https://i.ytimg.com/vi/${v.id}/${v.thumb ?? "hqdefault"}.jpg`}
                    alt=""
                    width={480}
                    height={360}
                    sizes="(max-width: 759px) 112px, (max-width: 1023px) 30vw, 310px"
                  />
                </span>
                <span className="video-text">
                  <span className="video-title">{v.title}</span>
                  <span className="sr-only">,</span>
                  <span className="video-meta">
                    {v.kind}, {v.context}, {v.year}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="more-actions">
          {featuredVideos.length > VIDEOS_SHOWN && (
            <MoreToggle
              listId="talk-videos"
              hidden={featuredVideos.length - VIDEOS_SHOWN}
              noun="talk videos"
            />
          )}
          <p className="more-link more-links">
            <a href={site.links.youtube}>All talks on YouTube</a>
            <a href={site.links.sessionize}>Speaker profile on Sessionize</a>
          </p>
        </div>
        <h3 className="group-label">On stage</h3>
        <ul className="row-list stage-list" id="on-stage">
          {stages.map((t, i) => {
            const city = t.location && !eventName(t).includes(t.location) ? t.location : undefined;
            const kind = [KIND[t.kind], city, isUpcoming(t) && "upcoming"].filter(Boolean);
            // A linked row reads as one link with the year and kind in its name,
            // so the three Web3 Lagos rows don't share one name.
            const linkOnly = t.href ? true : undefined;
            return (
              <li
                key={`${t.event}-${t.title ?? t.kind}`}
                className="row-item stage-row"
                data-extra={i >= STAGES_SHOWN || undefined}
              >
                <span className="stage-year" aria-hidden={linkOnly}>
                  {t.year}
                </span>
                <span className="stage-event">
                  {t.href ? (
                    <a className="card-link" href={t.href}>
                      {eventName(t)}
                      <span className="sr-only">, {[...kind, t.year].join(", ")}</span>
                    </a>
                  ) : (
                    eventName(t)
                  )}
                </span>
                <span className="stage-kind" aria-hidden={linkOnly}>
                  <span className="sr-only">, </span>
                  {kind.join(" · ")}
                </span>
              </li>
            );
          })}
        </ul>
        {stages.length > STAGES_SHOWN && (
          <div className="more-actions">
            <MoreToggle listId="on-stage" hidden={stages.length - STAGES_SHOWN} noun="events" />
          </div>
        )}
      </div>
    </section>
  );
}
