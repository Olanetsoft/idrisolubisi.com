import Link from "next/link";
import { caseStudies } from "@/data/case-studies";
import { Reveal } from "./Reveal";
import { ArrowRight } from "./Icons";

export function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="folio mono">
              <b>01</b> Selected work
            </p>
            <h2 id="work-title">Work that moved the numbers</h2>
          </div>
          <p>
            Four case studies from the last four years: an MCP server for AI agents, a cross-chain
            reference implementation, a 15,000-builder community and a body of writing that keeps
            compounding. Each one starts with a problem and ends with a measurement.
          </p>
        </Reveal>

        <div className="work-list">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={Math.min(i * 0.06, 0.2)}>
              <Link href={`/work/${cs.slug}`} className="work-item">
                <span className="work-index mono">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="work-meta mono">
                    <b>{cs.org}</b>
                    <span>{cs.role}</span>
                    <span>{cs.period}</span>
                  </p>
                  <h3 className="work-title">{cs.title}</h3>
                  <p className="work-summary">{cs.summary}</p>
                  <ul className="tags" aria-label="Topics">
                    {cs.tags.slice(0, 4).map((t) => (
                      <li className="tag" key={t}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="work-cta arrow-link mono">
                    Read the case study <ArrowRight />
                  </p>
                </div>
                <ul className="work-metrics" aria-label="Key results">
                  {cs.metrics.slice(0, 2).map((m) => (
                    <li key={m.label}>
                      <div className="value">{m.value}</div>
                      <div className="label">{m.label}</div>
                    </li>
                  ))}
                </ul>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
