import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { site } from "@/data/site";
import { ArrowUpRight } from "@/components/Icons";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} · ${cs.org}`,
    description: cs.summary,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      type: "article",
      url: `${site.url}/work/${cs.slug}`,
      title: `${cs.title} · ${cs.org}`,
      description: cs.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const index = caseStudies.findIndex((c) => c.slug === cs.slug);
  const prev = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article>
      <header className="case-hero container">
        <p className="folio mono">
          <b>{String(index + 1).padStart(2, "0")}</b> Case study
        </p>
        <p className="work-meta mono">
          <b>{cs.org}</b>
          <span>{cs.role}</span>
          <span>{cs.period}</span>
        </p>
        <h1>{cs.title}</h1>
        <p className="lede">{cs.summary}</p>
        <ul className="metrics case-metrics" aria-label="Key results">
          {cs.metrics.map((m) => (
            <li className="metric" key={m.label}>
              <div className="value">{m.value}</div>
              <div className="label">{m.label}</div>
            </li>
          ))}
        </ul>
      </header>

      <div className="case-body container">
        <aside className="case-aside">
          <div>
            <h4>Role</h4>
            <p>{cs.role}</p>
            <p className="muted">{cs.period}</p>
          </div>
          <div>
            <h4>Topics</h4>
            <ul className="tags" style={{ marginTop: 0 }}>
              {cs.tags.map((t) => (
                <li className="tag" key={t}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          {cs.links.length > 0 && (
            <div>
              <h4>Links</h4>
              <ul>
                {cs.links.map((l) => (
                  <li key={l.href}>
                    <a className="arrow-link" href={l.href} rel="noopener">
                      {l.label} <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <div className="case-content">
          {cs.sections.map((s) => (
            <section key={s.heading} aria-labelledby={s.heading}>
              <h2 id={s.heading}>{s.heading}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>

      <nav className="case-nav container" aria-label="More case studies">
        <Link href={`/work/${prev.slug}`}>
          <span className="mono">← Previous</span>
          <strong>{prev.org}</strong>
        </Link>
        <Link href={`/work/${next.slug}`}>
          <span className="mono">Next →</span>
          <strong>{next.org}</strong>
        </Link>
      </nav>
    </article>
  );
}
