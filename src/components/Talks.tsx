import Image from "next/image";
import { site } from "@/data/site";
import { stagePhotos, talks } from "@/data/talks";
import { featuredVideos } from "@/data/videos";
import { BrandIcon } from "./icons";
import { SectionLabel } from "./SectionLabel";
import { PhotoDialog } from "./PhotoDialog";
import { VideoDialog } from "./VideoDialog";

type Talk = (typeof talks)[number];

const KIND: Record<Talk["kind"], string> = {
  Keynote: "Keynote",
  Talk: "Talk",
  Workshop: "Workshop",
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
function highlightMeta(t: Talk): string {
  const kind = KIND[t.kind];
  const said = `${t.highlight} ${t.title ?? ""}`.toLowerCase();
  const showKind = !said.includes(kind.split(" ").pop()!.toLowerCase());
  const city = t.location && !eventName(t).includes(t.location) ? t.location : undefined;
  return [showKind ? kind : undefined, city, t.year].filter(Boolean).join(", ");
}

export function Talks() {
  const highlights = talks.filter((t) => t.highlight);
  const stages = talks.filter((t) => !t.highlight);
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
                      ? "(max-width: 759px) calc(100vw - 32px), (max-width: 1295px) 62vw, 780px"
                      : "(max-width: 759px) 46vw, (max-width: 1295px) 31vw, 390px"
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
          {highlights.map((t) => (
            <li key={t.event} className="highlight">
              <p className="highlight-label">{t.highlight}</p>
              <p className="highlight-event">
                {t.href ? <a href={t.href}>{eventName(t)}</a> : eventName(t)}
              </p>
              {t.title && <p className="highlight-title">{t.title}</p>}
              <p className="highlight-meta">{highlightMeta(t)}</p>
              {t.note && <p className="highlight-note">{t.note}</p>}
            </li>
          ))}
        </ul>
        <ul className="videos">
          {featuredVideos.map((v) => (
            <li key={v.id} className="video">
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
                    sizes="(max-width: 759px) 128px, (max-width: 1023px) 30vw, 336px"
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
        <p className="more-link more-links">
          <a href={site.links.youtube}>
            <BrandIcon name="youtube" />
            All talks on YouTube
          </a>
          <a href={site.links.sessionize}>Speaker profile on Sessionize</a>
        </p>
        <h3 className="group-label">On stage</h3>
        <ul className="row-list stage-list">
          {stages.map((t) => {
            const city = t.location && !eventName(t).includes(t.location) ? t.location : undefined;
            return (
              <li key={`${t.event}-${t.title ?? t.kind}`} className="row-item stage-row">
                <span className="stage-year">{t.year}</span>
                <span className="stage-event">
                  {t.href ? (
                    <a className="card-link" href={t.href}>
                      {eventName(t)}
                    </a>
                  ) : (
                    eventName(t)
                  )}
                </span>
                <span className="stage-kind">
                  <span className="sr-only">, </span>
                  {[KIND[t.kind], city].filter(Boolean).join(" · ")}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
