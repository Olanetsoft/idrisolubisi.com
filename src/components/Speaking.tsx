import { site } from "@/data/site";
import { talks } from "@/data/talks";

export function Speaking() {
  return (
    <section className="section" id="speaking" aria-labelledby="speaking-title">
      <div className="container section-grid">
        <div className="section-head">
          <h2 id="speaking-title">Selected speaking</h2>
          <p className="section-intro">
            Recordings on <a href={site.links.youtube}>YouTube</a>, including the ‘Midnight for
            Developers’ series.
          </p>
        </div>
        <div className="box">
          <ol className="rows">
            {talks.map((t) => {
              // With no talk title, the event is the title and the role is the note.
              const heading = t.title ?? t.event;
              return (
                <li className="row" key={`${t.event}-${heading}`}>
                  <p className="row-label">{t.year}</p>
                  <div className="row-body">
                    <h3 className="title">{t.href ? <a href={t.href}>{heading}</a> : heading}</h3>
                    <p className="note">
                      {t.title ? `${t.kind} at ${t.event}` : t.kind}
                      {t.location && `, ${t.location}`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
