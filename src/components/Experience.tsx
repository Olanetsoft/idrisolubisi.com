import { community, education, experience } from "@/data/experience";
import { site } from "@/data/site";
import { RichText } from "./RichText";
import { UiIcon } from "./icons";
import { SectionLabel } from "./SectionLabel";

/**
 * A timeline of cards: each role is its own card on a rail, with company,
 * title and dates, then a few short points with the figures in bold. The
 * community roles follow as smaller cards. The CV carries the full detail.
 */
export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="experience">Experience</SectionLabel>
          <p className="lede">Seven years in backend engineering and developer relations.</p>
        </div>
        <ol className="timeline">
          {experience.map((r) => (
            <li className="tl-item card spot" key={`${r.company}-${r.period}`}>
              <span className="tl-dot" aria-hidden="true" />
              <div className="tl-head">
                <h3 className="tl-company">{r.company}</h3>
                <p className="tl-role">{r.title}</p>
                <p className="tl-date">{r.period}</p>
              </div>
              <ul className="tl-points">
                {r.highlights.map((h) => (
                  <li key={h}>
                    <RichText text={h} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <h3 className="group-label">Community</h3>
        <ul className="community-list">
          {community.map((c) => (
            <li className="community-item card spot tilt" key={c.org}>
              <p className="community-head">
                <a className="card-link" href={c.href}>
                  {c.org}
                </a>
                {c.current && <span className="badge badge--live">Now</span>}
              </p>
              <p className="community-role">{c.role}</p>
              {c.note && <p className="community-note">{c.note}</p>}
            </li>
          ))}
        </ul>
        <div className="exp-foot">
          <p className="education-line">
            <span className="group-label">Education</span>
            {education.degree}, {education.school}, {education.year}
          </p>
          <p className="more-link">
            <a href={site.resumeUrl}>
              <UiIcon name="fileText" />
              Full CV (PDF)
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
