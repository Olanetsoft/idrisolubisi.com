import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { RichText } from "./RichText";

/**
 * A timeline: dates, then company and title, then one paragraph on everything
 * done in the role, spread across the width so it reads as three columns on
 * a wide screen. The CV carries the full detail.
 */
export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <h2 className="label" id="experience-title">
            <span className="label-index" aria-hidden="true" />
            Experience
          </h2>
          <p className="lede">Seven years in backend engineering and developer relations.</p>
        </div>
        <div className="box timeline-box">
          <ol className="timeline">
            {experience.map((r) => (
              <li className="tl-item" key={`${r.company}-${r.period}`}>
                <span className="tl-dot" aria-hidden="true" />
                <p className="tl-date">{r.period}</p>
                <div className="tl-head">
                  <h3 className="tl-company">{r.company}</h3>
                  <p className="tl-role">{r.title}</p>
                </div>
                <p className="tl-summary">
                  <RichText text={r.summary} />
                </p>
              </li>
            ))}
          </ol>
          <p className="row-more">
            <a href={site.resumeUrl}>Full CV (PDF)</a>
          </p>
        </div>
      </div>
    </section>
  );
}
