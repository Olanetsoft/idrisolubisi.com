import { recognition } from "@/data/recognition";
import { SectionLabel } from "./SectionLabel";

export function Recognition() {
  return (
    <section className="section" id="recognition" aria-labelledby="recognition-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="recognition">Recognition</SectionLabel>
        </div>
        <div className="box">
          <ul className="rows">
            {recognition.map((r) => (
              <li className="row" key={r.title}>
                <p className="row-label">
                  {r.by}
                  {r.note && ` (${r.note})`}
                </p>
                <div className="row-body">
                  <p className="title">{r.href ? <a href={r.href}>{r.title}</a> : r.title}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
