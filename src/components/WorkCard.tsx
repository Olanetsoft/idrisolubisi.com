import Image from "next/image";
import type { ReactNode } from "react";

type WorkCardProps = {
  /** Where the whole card goes. Without it the card is still: no light, no tilt (a private repo). */
  href?: string;
  rel?: string;
  image: string;
  /** Alt text only when the card is not a link; on a link the visible name labels it. */
  alt?: string;
  sizes: string;
  /** On the first screen: load at once, at high priority (the lead harness card). */
  eager?: boolean;
  /** A short mono tag on the image: a community role. */
  tag?: string;
  name: string;
  badge?: ReactNode;
  line: string;
  /** One proof line: bold on featured cards, mono elsewhere. */
  proof?: string;
  /** Extra words for screen readers, such as where the link goes. */
  srExtra?: string;
  /** Shown after the proof, such as "Private repo". */
  note?: string;
  size?: "feature" | "default" | "sm";
};

/**
 * One card for projects, more builds and community: a 16:10 screenshot set
 * just inside the raised card, then a name, one line and one number. The
 * whole card is a single link, with nothing interactive inside it.
 */
export function WorkCard({
  href,
  rel,
  image,
  alt = "",
  sizes,
  eager,
  tag,
  name,
  badge,
  line,
  proof,
  srExtra,
  note,
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
          sizes={sizes}
          loading={eager ? "eager" : undefined}
          fetchPriority={eager ? "high" : undefined}
        />
        {tag && (
          <span className="media-tag" aria-hidden="true">
            {tag}
          </span>
        )}
      </span>
      <div className="work-body">
        <div className="work-head">
          <h4 className="work-name">
            <span className="work-name-text">{name}</span>
          </h4>
          {badge}
        </div>
        {srExtra && <span className="sr-only">, {srExtra}.</span>}
        <span className="work-line">{line}</span>
        {(proof || note) && (
          <span className="work-foot">
            {proof && (
              <span className={size === "feature" ? "work-proof" : "work-meta"}>
                <span className="sr-only">. </span>
                {proof}
              </span>
            )}
            {note && <span className="pcard-note">{note}</span>}
          </span>
        )}
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
