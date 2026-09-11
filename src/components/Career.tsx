import { careerIntro, community, education, experience, stack } from "@/data/experience";

export function Career() {
  return (
    <section className="section" id="career" aria-labelledby="career-title">
      <div className="container">
        <h2 id="career-title">Career</h2>
        <p className="intro">{careerIntro}</p>

        <table className="cv-table">
          <caption className="visually-hidden">Work history, most recent first</caption>
          <thead className="visually-hidden">
            <tr>
              <th scope="col">Period</th>
              <th scope="col">Company and title</th>
              <th scope="col">Highlights</th>
            </tr>
          </thead>
          <tbody>
            {experience.map((r) => (
              <tr key={`${r.company}-${r.period}`}>
                <th scope="row" className="period">
                  {r.period}
                </th>
                <td className="role">
                  <b>{r.url ? <a href={r.url}>{r.company}</a> : r.company}</b>
                  <br />
                  {r.title}
                </td>
                <td>
                  <ul>
                    {r.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="facts">
          <dt>Education</dt>
          <dd>
            {education.degree}, {education.school}, {education.year}.
          </dd>
          <dt>Community</dt>
          <dd>
            {community.map((c, i) => (
              <span key={c.org}>
                <a href={c.href}>{c.org}</a> ({c.role}){i < community.length - 1 ? "; " : "."}
              </span>
            ))}
          </dd>
          <dt>Stack</dt>
          <dd>{stack.join(", ")}.</dd>
        </dl>
      </div>
    </section>
  );
}
