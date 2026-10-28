import type { Metadata } from "next";
import Link from "next/link";
import { html } from "@/content/how-to-create-react-app";
import { site } from "@/data/site";

const title = "How To Create A React App - Stress Free";
const description =
  "In this article, you will learn how to create a React app stress free in a couple of minutes.";
const path = "/how-to-create-react-app";
const published = "2020-02-15";
const image = "/archive/how-to-create-react-app/react-introduction-pic.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  // A page's openGraph and twitter replace the root ones whole, so the shared
  // fields are repeated here; without twitter, X would show the homepage's.
  openGraph: {
    type: "article",
    url: `${site.url}${path}`,
    siteName: site.name,
    locale: "en_GB",
    title,
    description,
    publishedTime: published,
    images: [{ url: image, width: 850, height: 370 }],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${site.handle}`,
    creator: `@${site.handle}`,
    title,
    description,
    images: [image],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: title,
  description,
  datePublished: published,
  url: `${site.url}${path}`,
  mainEntityOfPage: `${site.url}${path}`,
  image: `${site.url}${image}`,
  author: { "@id": `${site.url}/#person` },
};

export default function ArchivedPost() {
  return (
    <article className="container article">
      <Link className="back-link" href="/">
        Home
      </Link>
      <header className="article-head">
        <h1>{title}</h1>
        <p className="meta">15 February 2020 · archived from my old blog</p>
      </header>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
      <p className="article-foot">
        More writing on <a href={site.links.blog}>blog.idrisolubisi.com</a>.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
