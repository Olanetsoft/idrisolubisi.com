import { community, education, experience, stack } from "@/data/experience";

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <h2 id="experience-title">Experience</h2>
        <p className="section-intro">
          Backend engineer first, then developer relations at Mara, Axelar and Midnight. The
          engineering came first; it is why the advocacy holds up on a hard partner call.
        </p>
        <ol className="timeline">
          {experience.map((r) => (
            <li className="role-item" key={`${r.company}-${r.period}`}>
              <div className="role-when">
                <p className="period">{r.period}</p>
                {r.location && <p className="meta">{r.location}</p>}
              </div>
              <div>
                <h3>
                  {r.url ? <a href={r.url}>{r.company}</a> : r.company}
                  <span className="role-title"> · {r.title}</span>
                </h3>
                {r.scope && <p className="scope">{r.scope}</p>}
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
            <dt>Stack</dt>
            <dd>{stack.join(", ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
