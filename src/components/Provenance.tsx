import type { ReactNode } from "react";

type Props = {
  source: string;
  href?: string;
  date?: string;
  children?: ReactNode;
  className?: string;
};

/** `detail · source · date` under an exhibit or a figure. Never under a heading. */
export function Provenance({ source, href, date, children, className }: Props) {
  return (
    <p className={["provenance", className].filter(Boolean).join(" ")}>
      {children != null && children !== false && <>{children} · </>}
      {href ? <a href={href}>{source}</a> : source}
      {date && <> · {date}</>}
    </p>
  );
}
