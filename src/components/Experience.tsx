import { community, education, experience, stack } from "@/data/experience";
import { site } from "@/data/site";

/** One line per role. The detail lives in the CV and in /llms.txt. */
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
              <div>
                <h3>
                  {r.url ? <a href={r.url}>{r.company}</a> : r.company}
                  <span className="role-title"> · {r.title}</span>
                </h3>
                <p className="scope">{r.scope}</p>
              </div>
            </li>
          ))}
        </ol>

        <dl className="facts">
          <div>
            <dt>Education</dt>
            <dd>
              {education.degree}, {education.school}, {education.year}
            </dd>
          </div>
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
          <div>
            <dt>Stack</dt>
            <dd>{stack.join(", ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
