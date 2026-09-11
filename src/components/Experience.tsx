import { community, education, experience, stack } from "@/data/experience";

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <h2 id="experience-title">Experience</h2>
        <ol className="timeline">
          {experience.map((r) => (
            <li className="role-item" key={`${r.company}-${r.period}`}>
              <p className="period">{r.period}</p>
              <div>
                <h3>
                  {r.title}
                  <span className="company">
                    {" · "}
                    {r.url ? <a href={r.url}>{r.company}</a> : r.company}
                  </span>
                </h3>
                <ul className="bullets">
                  {r.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
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
            <dt>Skills</dt>
            <dd>{stack.join(", ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
