import Image from "next/image";

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
  line: string;
  /** Extra words for screen readers, such as where the link goes. */
  srExtra?: string;
  size?: "feature" | "default" | "sm";
};

/**
 * One card for projects, more builds and community: a 16:10 screenshot,
 * shown 16:9 with its top kept, just inside the raised card, then a name and
 * one line. The whole card is a single link, with nothing
 * interactive inside it.
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
