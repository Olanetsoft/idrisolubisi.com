"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { FeaturedVideo } from "@/data/videos";

/**
 * The rows of the long lists on the home page. Nothing here needs the browser:
 * they are client components because the page's inline data carries a client
 * component's props but not its markup. Each row still arrives whole in the
 * HTML, and the markup is sent once, here, rather than again for every row.
 */

export function VideoRow({ video, extra }: { video: FeaturedVideo; extra?: boolean }) {
  const { id, start, thumb = "hqdefault", title, kind, context, year } = video;
  return (
    <li className="video" data-extra={extra}>
      <a
        className="video-link"
        href={`https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`}
        data-video-id={id}
        data-video-start={start}
        data-video-title={title}
      >
        <span className="video-thumb">
          <Image
            src={`https://i.ytimg.com/vi/${id}/${thumb}.jpg`}
            alt=""
            width={480}
            height={360}
            sizes="(max-width: 759px) 112px, (max-width: 1023px) 30vw, 310px"
          />
        </span>
        <span className="video-text">
          <span className="video-title">{title}</span>
          <span className="sr-only">,</span>
          <span className="video-meta">
            {kind}, {context}, {year}
          </span>
        </span>
      </a>
    </li>
  );
}

export function StageRow({
  year,
  event,
  href,
  kind,
  heard,
  extra,
}: {
  year?: string;
  event: string;
  href?: string;
  /** What the row shows after the event. */
  kind: string;
  /** What a screen reader hears inside a linked row: the year and kind are in its name. */
  heard?: string;
  extra?: boolean;
}) {
  // A linked row reads as one link with the year and kind in its name,
  // so the three Web3 Lagos rows don't share one name.
  const linkOnly = href ? true : undefined;
  return (
    <li className="row-item stage-row" data-extra={extra}>
      <span className="stage-year" aria-hidden={linkOnly}>
        {year}
      </span>
      <span className="stage-event">
        {href ? (
          <a className="card-link" href={href}>
            {event}
            <span className="sr-only">, {heard}</span>
          </a>
        ) : (
          event
        )}
      </span>
      <span className="stage-kind" aria-hidden={linkOnly}>
        <span className="sr-only">, </span>
        {kind}
      </span>
    </li>
  );
}

export function ArticleRow({
  date,
  month,
  outlet,
  href,
  title,
  children,
}: {
  date: string;
  month: string;
  outlet: string;
  href: string;
  title: string;
  /** The Loose Leaf door, on the row it hangs from. */
  children?: ReactNode;
}) {
  return (
    <li className="row-item">
      <p className="card-kicker">
        <time dateTime={date}>{month}</time>
        <span aria-hidden="true">·</span>
        {outlet}
      </p>
      <h3 className="card-title">
        <a className="card-link" href={href}>
          {title}
        </a>
      </h3>
      {children}
    </li>
  );
}

export function RoleRow({
  title,
  company,
  years,
}: {
  title: string;
  company: string;
  years: string;
}) {
  return (
    <li className="xp-row">
      <span className="xp-title">{title}</span>
      <span className="xp-where">
        <span className="xp-company">{company}</span>
        <span className="xp-years">
          <span className="sr-only">, </span>
          {years}
        </span>
      </span>
    </li>
  );
}

export function QuoteRow({
  quote,
  href,
  name,
  relation,
}: {
  quote: string;
  href: string;
  name: string;
  relation: string;
}) {
  return (
    <li>
      <figure className="quote-card">
        <blockquote className="quote-text">
          <p>“{quote}”</p>
        </blockquote>
        <figcaption className="quote-by">
          <a href={href}>{name}</a>
          <span className="quote-relation">{relation}</span>
        </figcaption>
      </figure>
    </li>
  );
}

function PressTitle({ title, href }: { title: string; href?: string }) {
  return href ? (
    <a className="card-link" href={href}>
      {title}
    </a>
  ) : (
    title
  );
}

type PressProps = { by: string; title: string; href?: string };

export function PressCard({ by, title, href }: PressProps) {
  return (
    <li className="press-card">
      <p className="press-outlet">{by}</p>
      <h4 className="press-headline">
        <PressTitle title={title} href={href} />
      </h4>
    </li>
  );
}

/** A row: who, set strong, then the headline small. The row is the link. */
export function PressRow({ by, title, href }: PressProps) {
  return (
    <li className="row-item press-row">
      <p className="press-by">{by}</p>
      <h4 className="card-title">
        <PressTitle title={title} href={href} />
      </h4>
    </li>
  );
}
