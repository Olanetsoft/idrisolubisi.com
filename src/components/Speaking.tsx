import { site } from "@/data/site";
import { talks } from "@/data/talks";

export function Speaking() {
  return (
    <section className="section" id="speaking" aria-labelledby="speaking-title">
      <div className="container section-grid">
        <h2 id="speaking-title">Selected speaking</h2>
        <div>
          <p className="section-intro">
            Recordings on <a href={site.links.youtube}>YouTube</a>; full list on{" "}
            <a href={site.links.sessionize}>Sessionize</a>.
          </p>
          <ol className="rows">
            {talks.map((t) => (
              <li className="row" key={`${t.event}-${t.title}`}>
                <p className="row-label">{t.year}</p>
                <div className="row-body">
                  <h3 className="title">{t.href ? <a href={t.href}>{t.title}</a> : t.title}</h3>
                  <p className="note">
                    {t.kind} · {t.event}
                    {t.location && `, ${t.location}`}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
