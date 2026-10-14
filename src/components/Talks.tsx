import Image from "next/image";
import { site } from "@/data/site";
import { talks } from "@/data/talks";
import { featuredVideos } from "@/data/videos";
import { BrandIcon } from "./icons";
import { SectionLabel } from "./SectionLabel";

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

/** "Keynote · Beyond H-1B: ...", or just the title when it already says what the role was. */
function roleLine(t: Talk): string {
  const kind = KIND[t.kind];
  if (!t.title) return kind;
  const firstWord = kind.split(" ").pop()!.toLowerCase();
  return t.title.toLowerCase().includes(firstWord) ? t.title : `${kind} · ${t.title}`;
}

export function Talks() {
  return (
    <section className="section" id="talks" aria-labelledby="talks-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="talks">Talks and workshops</SectionLabel>
          <p className="lede">Recorded workshops, talks and live builds.</p>
          <p className="lede-sub">
            Recordings on <a href={site.links.youtube}>YouTube</a>.
          </p>
        </div>
        <ul className="videos">
          {featuredVideos.map((v) => (
            <li key={v.id} className="video">
              <a
                className="video-link"
                href={`https://www.youtube.com/watch?v=${v.id}${v.start ? `&t=${v.start}s` : ""}`}
              >
                <span className="video-thumb tilt">
                  <Image
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt=""
                    width={480}
                    height={360}
                    sizes="(max-width: 759px) 128px, (max-width: 1023px) 45vw, 336px"
                  />
                </span>
                <span className="video-text">
                  <span className="video-title">{v.title}</span>
                  <span className="video-meta">
                    {v.kind}&nbsp;<span aria-hidden="true">·</span> {v.context}&nbsp;
                    <span aria-hidden="true">·</span> {v.year}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="more-link more-links">
          <a href={site.links.youtube}>
            <BrandIcon name="youtube" />
            All videos on YouTube
          </a>
          <a href={site.links.sessionize}>Speaker profile on Sessionize</a>
        </p>
        <h3 className="group-label stages-label">On stage</h3>
        <div className="box">
          <ul className="stage-grid">
            {talks.map((t) => (
              <li key={`${t.event}-${t.title ?? t.kind}`} className="stage">
                <span className="stage-year">{t.year}</span>
                <span className="stage-body">
                  <span className="stage-event">
                    {t.href ? <a href={t.href}>{eventName(t)}</a> : eventName(t)}
                  </span>
                  <span className="stage-role">{roleLine(t)}</span>
                  {t.location && <span className="stage-city">{t.location}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
