import type { Metadata } from "next";
import Link from "next/link";
import { html } from "@/content/how-to-create-react-app";
import { site } from "@/data/site";

const title = "How To Create A React App - Stress Free";
const description =
  "In this article, you will learn how to create a React app stress free in a couple of minutes.";
const path = "/how-to-create-react-app";
const published = "2020-02-15";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "article",
    url: `${site.url}${path}`,
    title,
    description,
    publishedTime: published,
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
  image: `${site.url}/archive/how-to-create-react-app/react.png`,
  author: { "@id": `${site.url}/#person` },
};

export default function ArchivedPost() {
  return (
    <article className="container article">
      <Link className="back-link" href="/">
        ← Idris Olubisi
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
