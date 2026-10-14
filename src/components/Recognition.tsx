import { recognition } from "@/data/recognition";
import { SectionLabel } from "./SectionLabel";

/** Press, honours and interviews as a scannable list: who, then the headline. */
export function Recognition() {
  return (
    <section className="section" id="recognition" aria-labelledby="recognition-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="recognition">Recognition</SectionLabel>
        </div>
        <ul className="row-list">
          {recognition.map((r) => (
            <li className="row-item" key={r.title}>
              <p className="card-kicker">
                {r.by}
                {r.note && ` (${r.note})`}
              </p>
              <h3 className="card-title">
                {r.href ? (
                  <a className="card-link" href={r.href}>
                    {r.title}
                  </a>
                ) : (
                  r.title
                )}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
