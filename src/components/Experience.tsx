import { community, education, experience } from "@/data/experience";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { QuoteRow, RoleRow } from "./ListRows";
import { SectionLabel } from "./SectionLabel";
import { WorkCard } from "./WorkCard";

/** "Feb 2021–Dec 2021" becomes "2021"; "Apr 2023–Aug 2025" becomes "2023–2025". */
function years(period: string): string {
  const [from, to] = period.split("–").map((part) => part.match(/\d{4}/)?.[0]);
  return !to || from === to ? (from ?? period) : `${from}–${to}`;
}

/**
 * Experience as a short list: title, company and years for each role. The
 * CV carries the detail. Recommendations from people who worked or studied
 * with him follow, word for word from LinkedIn, then Community as picture
 * cards.
 */
export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="experience">Experience</SectionLabel>
          <p className="lede">Seven years, backend to developer relations.</p>
        </div>
        <ol className="xp-list">
          {experience.map((r) => (
            <RoleRow
              key={`${r.company}-${r.period}`}
              title={r.title}
              company={r.company}
              years={years(r.period)}
            />
          ))}
        </ol>
        <h3 className="group-label">Recommendations</h3>
        <ul className="quote-grid">
          {testimonials.map((t) => (
            <QuoteRow
              key={t.name}
              quote={t.quote}
              href={t.href}
              name={t.name}
              relation={t.relation}
            />
          ))}
        </ul>
        <h3 className="group-label">Community</h3>
        <ul className="community-grid">
          {community.map((c) => (
            <li key={c.org}>
              <WorkCard
                href={c.href}
                image={c.image}
                tag={c.role}
                name={c.org}
                line={c.summary}
                srExtra={c.role}
                size="sm"
              />
            </li>
          ))}
        </ul>
        <div className="exp-foot">
          <p className="education-line">
            <span className="group-label">Education</span>
            {education.degree}, {education.school}, {education.year}
          </p>
          <p className="more-link">
            <a href={site.resumeUrl}>Full CV (PDF)</a>
          </p>
        </div>
      </div>
    </section>
  );
}
