import type { Metadata } from "next";
import Link from "next/link";
import { ReadinessCheck } from "@/components/ReadinessCheck";
import { site } from "@/data/site";

const path = "/tools/ai-readiness";
const title = "AI readiness check";
const description =
  "Check how a website looks to AI agents and answer engines: llms.txt, content without JavaScript, structured data, crawler access and a sitemap.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  // A page's openGraph and twitter replace the root ones whole, so the shared
  // fields are repeated here; without twitter, X would show the homepage's.
  openGraph: {
    type: "website",
    url: `${site.url}${path}`,
    siteName: site.name,
    locale: "en_GB",
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${site.handle}`,
    creator: `@${site.handle}`,
    title,
    description,
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: title,
  description,
  url: `${site.url}${path}`,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  author: { "@id": `${site.url}/#person` },
};

/** A free tool: what AI agents and crawlers find on a site, from its public files. */
export default function AiReadinessPage() {
  return (
    <article className="container case tool">
      <Link className="back-link" href="/#work">
        Projects
      </Link>
      <header className="case-head">
        <p className="case-kicker">Free tool</p>
        <h1>{title}</h1>
        <p className="case-lede">
          See a website the way an AI agent does: whether it has an llms.txt, what its HTML says
          before any script runs, its structured data, which AI crawlers robots.txt lets in, and its
          sitemap.
        </p>
      </header>
      <ReadinessCheck />
      <footer className="case-foot">
        <p>
          This site&apos;s own: <a href="/llms.txt">llms.txt</a> and{" "}
          <a href="/llms-full.txt">llms-full.txt</a>.
        </p>
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
