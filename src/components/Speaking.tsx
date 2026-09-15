import { site } from "@/data/site";
import { talks } from "@/data/talks";

export function Speaking() {
  return (
    <section className="section" id="speaking" aria-labelledby="speaking-title">
      <div className="container">
        <h2 id="speaking-title">Selected speaking</h2>
        <p className="section-intro">
          Recordings on <a href={site.links.youtube}>YouTube</a>; full list on{" "}
          <a href={site.links.sessionize}>Sessionize</a>.
        </p>
        <ol className="talk-list">
          {talks.map((t) => (
            <li key={`${t.event}-${t.title}`}>
              <p className="period">{t.year}</p>
              <div>
                <h3>{t.href ? <a href={t.href}>{t.title}</a> : t.title}</h3>
                <p className="meta">
                  {t.kind} · {t.event}
                  {t.location && `, ${t.location}`}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
