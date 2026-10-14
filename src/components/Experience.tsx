import { community, education, experience } from "@/data/experience";
import { site } from "@/data/site";
import { RichText } from "./RichText";
import { UiIcon } from "./icons";
import { SectionLabel } from "./SectionLabel";

/**
 * A timeline: dates, then company and title, then one paragraph on everything
 * done in the role, spread across the width so it reads as three columns on
 * a wide screen. The CV carries the full detail.
 */
export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="experience">Experience</SectionLabel>
          <p className="lede">Seven years in backend engineering and developer relations.</p>
        </div>
        <div className="box timeline-box">
          <ol className="timeline">
            {experience.map((r) => (
              <li className="tl-item" key={`${r.company}-${r.period}`}>
                <span className="tl-dot" aria-hidden="true" />
                <p className="tl-date">{r.period}</p>
                <div className="tl-head">
                  <h3 className="tl-company">{r.company}</h3>
                  <p className="tl-role">{r.title}</p>
                </div>
                <p className="tl-summary">
                  <RichText text={r.summary} />
                </p>
              </li>
            ))}
          </ol>
          <div className="community">
            <h3 className="group-label community-label">Community</h3>
            <ul className="community-list">
              {community.map((c) => (
                <li className="community-item" key={c.org}>
                  <p className="community-head">
                    <a href={c.href}>{c.org}</a>
                    {c.current && <span className="badge badge--live">Now</span>}
                  </p>
                  <p className="community-role">{c.role}</p>
                  {c.note && <p className="community-note">{c.note}</p>}
                </li>
              ))}
            </ul>
          </div>
          <div className="education">
            <h3 className="group-label">Education</h3>
            <p className="education-line">
              {education.degree}, {education.school}, {education.year}
            </p>
          </div>
          <p className="row-more">
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
