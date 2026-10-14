import { experience } from "@/data/experience";
import { site } from "@/data/site";

/** Dates, company, title and one paragraph on everything done in the role. The CV carries the full detail. */
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
        <div className="box">
          <ol className="rows">
            {experience.map((r) => (
              <li className="row" key={`${r.company}-${r.period}`}>
                <p className="row-label">{r.period}</p>
                <div className="row-body">
                  <h3 className="title">
                    <span className="company">{r.company}</span>
                    <span className="role-title">, {r.title}</span>
                  </h3>
                  <p className="row-summary">{r.summary}</p>
                </div>
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
