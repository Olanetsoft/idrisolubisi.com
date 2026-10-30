import type { Metadata } from "next";
import Link from "next/link";
import { TradeFlow } from "@/components/TradeFlow";
import { site } from "@/data/site";
import { swoopagent } from "@/data/swoopagent";

const { path, title, description, published } = swoopagent;
const pageTitle = `${title} case study`;
const image = "/images/work/swoopagent-loop.jpg";

export const metadata: Metadata = {
  title: pageTitle,
  description,
  alternates: { canonical: path },
  // A page's openGraph and twitter replace the root ones whole, so the shared
  // fields are repeated here; without twitter, X would show the homepage's.
  openGraph: {
    type: "article",
    url: `${site.url}${path}`,
    siteName: site.name,
    locale: "en_GB",
    title: pageTitle,
    description,
    publishedTime: published,
    images: [{ url: image, width: 1280, height: 800 }],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${site.handle}`,
    creator: `@${site.handle}`,
    title: pageTitle,
    description,
    images: [image],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: pageTitle,
  description,
  datePublished: published,
  url: `${site.url}${path}`,
  mainEntityOfPage: `${site.url}${path}`,
  image: `${site.url}${image}`,
  author: { "@id": `${site.url}/#person` },
  about: {
    "@type": "SoftwareApplication",
    name: title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    author: { "@id": `${site.url}/#person` },
  },
};

/** The one case study: what SwoopAgent did, how a trade moved, and the hard parts. */
export default function SwoopAgentCaseStudy() {
  return (
    <article className="container case">
      <Link className="back-link" href="/#work">
        Projects
      </Link>
      <header className="case-head">
        <p className="case-kicker">Case study</p>
        <h1>{title}</h1>
        <p className="case-lede">{swoopagent.lede}</p>
        <dl className="case-facts">
          {swoopagent.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>
      <section className="case-section" aria-labelledby="case-what">
        <h2 id="case-what">What it did</h2>
        <p>{swoopagent.what}</p>
      </section>
      <section className="case-section" aria-labelledby="case-how">
        <h2 id="case-how">How a trade moved</h2>
        <p>{swoopagent.how}</p>
        <TradeFlow />
      </section>
      <section className="case-section" aria-labelledby="case-hard">
        <h2 id="case-hard">The hard parts</h2>
        <div className="case-points">
          {swoopagent.hard.map((h) => (
            <div key={h.title} className="case-point">
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="case-foot">
        <p>Built in February 2026. The repo is private.</p>
        <p className="more-link">
          <Link href="/#work">More projects</Link>
        </p>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
