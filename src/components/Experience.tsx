import { community, education, experience, skills } from "@/data/experience";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="folio mono">
              <b>03</b> Experience
            </p>
            <h2 id="experience-title">Seven years, three chapters</h2>
          </div>
          <p>
            Backend engineer first, then developer relations, and now building for the moment when
            the first developer to read your docs is an AI agent. The engineering never stopped —
            it&rsquo;s what makes the advocacy credible.
          </p>
        </Reveal>

        <Reveal>
          <ol className="timeline" aria-label="Work history">
            {experience.map((r) => (
              <li className="role" key={`${r.company}-${r.period}`}>
                <span className="period mono">{r.period}</span>
                <div>
                  <p className="company">
                    {r.url ? (
                      <a href={r.url} rel="noopener">
                        {r.company}
                      </a>
                    ) : (
                      r.company
                    )}
                  </p>
                  <p className="title">{r.title}</p>
                  <p className="location">{r.location}</p>
                </div>
                <ul>
                  {r.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="aside-grid" delay={0.1}>
          <div>
            <h3>Skills</h3>
            {skills.map((g) => (
              <div className="skill-group" key={g.group}>
                <b>{g.group}</b>
                <span>{g.items.join(" · ")}</span>
              </div>
            ))}
          </div>
          <div>
            <h3>Community</h3>
            {community.map((c) => (
              <div className="community-item" key={c.org}>
                <b>
                  <a href={c.href} rel="noopener" className="link">
                    {c.org}
                  </a>
                </b>
                <span className="r">{c.role}</span>
                <p>{c.note}</p>
              </div>
            ))}
          </div>
          <div>
            <h3>Education</h3>
            <div className="community-item">
              <b>{education.degree}</b>
              <p>
                {education.school}, {education.year}
              </p>
            </div>
            <h3 style={{ marginTop: "1.5rem" }}>Right to work</h3>
            <div className="community-item">
              <b>UK Global Talent visa</b>
              <p>Endorsed for digital technology; no sponsorship required in the UK.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
