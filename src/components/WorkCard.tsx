"use client";

import Image from "next/image";

/** Three cards to a row in the 960px page column; on phones one row each, the picture 112px wide. */
const CARD_SIZES = "(max-width: 759px) 112px, (max-width: 1023px) 30vw, 310px";

/** Four small cards to a row, two on phones. */
const SMALL_CARD_SIZES = "(max-width: 759px) 46vw, (max-width: 1023px) 23vw, 230px";

type WorkCardProps = {
  /** Where the whole card goes. Without it the card is still: no light, no tilt (a private repo). */
  href?: string;
  rel?: string;
  image: string;
  /** Alt text only when the card is not a link; on a link the visible name labels it. */
  alt?: string;
  /** On the first screen: load at once (the lead harness card; the portrait has the high priority). */
  eager?: boolean;
  /** A short mono tag on the image: a community role. */
  tag?: string;
  name: string;
  line: string;
  /** Extra words for screen readers, such as where the link goes. */
  srExtra?: string;
  size?: "feature" | "default" | "sm";
};

/**
 * One card for projects, more builds and community: a 16:10 screenshot,
 * shown 16:9 with its top kept, just inside the raised card, then a name and
 * one line. The whole card is a single link, with nothing
 * interactive inside it. A client component only so that the page's inline
 * data carries its props and not its markup, as in ListRows.tsx.
 */
export function WorkCard({
  href,
  rel,
  image,
  alt = "",
  eager,
  tag,
  name,
  line,
  srExtra,
  size = "default",
}: WorkCardProps) {
  const className = [
    "work-card",
    size === "feature" && "work-card--feature",
    size === "sm" && "work-card--sm",
    href && "spot",
    href && "tilt",
  ]
    .filter(Boolean)
    .join(" ");
  const body = (
    <>
      <span className="work-media">
        <Image
          src={image}
          alt={href ? "" : alt}
          width={1280}
          height={800}
          sizes={size === "sm" ? SMALL_CARD_SIZES : CARD_SIZES}
          loading={eager ? "eager" : undefined}
        />
        {tag && (
          <span className="media-tag" aria-hidden="true">
            {tag}
          </span>
        )}
      </span>
      <div className="work-body">
        <h4 className="work-name">
          <span className="work-name-text">{name}</span>
        </h4>
        {srExtra && <span className="sr-only">, {srExtra}.</span>}
        <span className="work-line">{line}</span>
      </div>
    </>
  );
  return href ? (
    <a className={className} href={href} rel={rel}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
