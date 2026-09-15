import { community, experience, stack } from "@/data/experience";
import { site } from "@/data/site";

/** The arc, not the detail: dates, company, title. The CV carries the rest. */
export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <h2 id="experience-title">Experience</h2>
          <a className="see-all" href={site.resumeUrl}>
            Full CV (PDF) →
          </a>
        </div>
        <ol className="timeline">
          {experience.map((r) => (
            <li className="role-item" key={`${r.company}-${r.period}`}>
              <p className="period">{r.period}</p>
              <h3>
                {r.url ? <a href={r.url}>{r.company}</a> : r.company}
                <span className="role-title"> · {r.title}</span>
              </h3>
            </li>
          ))}
        </ol>

        <dl className="facts">
          <div>
            <dt>Community</dt>
            <dd>
              {community.map((c, i) => (
                <span key={c.org}>
                  <a href={c.href}>{c.org}</a> ({c.role}){i < community.length - 1 ? "; " : ""}
                </span>
              ))}
            </dd>
          </div>
          {stack.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
