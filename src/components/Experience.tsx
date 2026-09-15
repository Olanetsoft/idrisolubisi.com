import { community, experience, stack } from "@/data/experience";
import { site } from "@/data/site";

/** The arc, not the detail: dates, company, title. The CV carries the rest. */
export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container section-grid">
        <h2 id="experience-title">Experience</h2>
        <div>
          <ol className="rows">
            {experience.map((r) => (
              <li className="row" key={`${r.company}-${r.period}`}>
                <p className="row-label">{r.period}</p>
                <div className="row-body">
                  <h3 className="title">
                    {r.url ? <a href={r.url}>{r.company}</a> : r.company}
                    <span className="role-title"> · {r.title}</span>
                  </h3>
                </div>
              </li>
            ))}
            <li className="row-more">
              <a href={site.resumeUrl}>Full CV (PDF) →</a>
            </li>
          </ol>

          <dl className="rows facts">
            <div className="row">
              <dt className="row-label">Community</dt>
              <dd>
                {community.map((c, i) => (
                  <span key={c.org}>
                    <a href={c.href}>{c.org}</a> ({c.role}){i < community.length - 1 ? "; " : ""}
                  </span>
                ))}
              </dd>
            </div>
            {stack.map((group) => (
              <div className="row" key={group.label}>
                <dt className="row-label">{group.label}</dt>
                <dd>{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
