import { experience } from "@/data/experience";
import { site } from "@/data/site";

/** The arc, not the detail: dates, company, title. The CV carries the rest. */
export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container section-grid">
        <h2 id="experience-title">Experience</h2>
        <ol className="rows">
          {experience.map((r) => (
            <li className="row" key={`${r.company}-${r.period}`}>
              <p className="row-label">{r.period}</p>
              <div className="row-body">
                <h3 className="title">
                  <span className="company">{r.company}</span>
                  <span className="role-title">, {r.title}</span>
                </h3>
              </div>
            </li>
          ))}
          <li className="row-more">
            <a href={site.resumeUrl}>Full CV (PDF)</a>
          </li>
        </ol>
      </div>
    </section>
  );
}
