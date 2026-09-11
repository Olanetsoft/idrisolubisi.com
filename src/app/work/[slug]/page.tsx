import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { installLine } from "@/data/exhibits";
import { site } from "@/data/site";
import { CopyLine } from "@/components/CopyLine";
import { OutputLine } from "@/components/OutputLine";
import { WorkExhibit } from "@/components/Work";

type Params = { slug: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
    <article className="case">
      <header className="container case-head">
        <p className="meta">
          {cs.org} · {cs.role} · {cs.period}
        </p>
        <h1>{cs.title}</h1>
        <p className="standfirst">{cs.story}</p>
        {cs.status && <p className="status">{cs.status}</p>}
        <OutputLine output={cs.output} mark={false} />
        <p className="note">{cs.skipped}</p>
      </header>

      <div className="container case-body">
        <aside className="case-aside">
          <h2 className="aside-h">Role</h2>
          <p>
            {cs.role}, {cs.period}
          </p>
          <h2 className="aside-h">Stack</h2>
          <p>{cs.stack}</p>
          {cs.links.length > 0 && (
            <>
              <h2 className="aside-h">Links</h2>
              <ul className="plain-list">
                {cs.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {cs.exhibit === "toolCategories" && <CopyLine command={installLine} />}
          {cs.showOnHome !== false && <WorkExhibit kind={cs.exhibit} />}
        </aside>

        <div className="case-content">
          {cs.sections.map((s) => {
            const id = slugify(s.heading);
            return (
              <section key={s.heading} aria-labelledby={id}>
                <h2 id={id}>{s.heading}</h2>
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
            );
          })}
        </div>
      </div>

      <nav className="container case-nav" aria-label="More work">
        <p>
          Previous: <Link href={`/work/${prev.slug}`}>{prev.org}</Link>
        </p>
        <p>
          Next: <Link href={`/work/${next.slug}`}>{next.org}</Link>
        </p>
      </nav>
    </article>
  );
}
