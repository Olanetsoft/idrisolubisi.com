import Image from "next/image";
import { site } from "@/data/site";
import { stagePhoto, talks } from "@/data/talks";

export function Talks() {
  return (
    <section className="section" id="talks" aria-labelledby="talks-title">
      <figure className="bleed">
        <Image
          src={stagePhoto.src}
          alt={stagePhoto.alt}
          width={stagePhoto.width}
          height={stagePhoto.height}
          sizes="100vw"
        />
        <figcaption className="container">{stagePhoto.caption}</figcaption>
      </figure>

      <div className="container">
        <h2 id="talks-title">Talks</h2>
        <p className="intro">Keynotes, talks and workshops, mostly about getting developers unstuck.</p>
        <ol className="talk-list">
          {talks.map((t) => (
            <li key={`${t.event}-${t.title}`}>
              <span className="period">{t.year}</span>
              <div>
                <p className="talk-event">
                  {t.event}
                  {t.location && `, ${t.location}`}
                  <span className="meta"> {t.kind.toLowerCase()}</span>
                </p>
                <p className="talk-title">{t.href ? <a href={t.href}>{t.title}</a> : t.title}</p>
                {t.note && <p className="meta">{t.note}</p>}
              </div>
            </li>
          ))}
        </ol>
        <p className="after">
          Speaker profile on <a href={site.links.sessionize}>Sessionize</a>, recordings on{" "}
          <a href={site.links.youtube}>YouTube</a>, invitations through the{" "}
          <a href="#contact">contact section</a>.
        </p>
      </div>
    </section>
  );
}
