import { site } from "@/data/site";
import { talks } from "@/data/talks";

export function Speaking() {
  return (
    <section className="section" id="speaking" aria-labelledby="speaking-title">
      <div className="container">
        <h2 id="speaking-title">Speaking</h2>
        <p className="section-intro">
          Keynotes, talks and workshops on developer tooling, zero-knowledge, cross-chain
          development and developer communities. Speaker profile on{" "}
          <a href={site.links.sessionize}>Sessionize</a>; recordings on{" "}
          <a href={site.links.youtube}>YouTube</a>.
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
                  {t.note && ` · ${t.note}`}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
