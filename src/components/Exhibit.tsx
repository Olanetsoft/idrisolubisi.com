import type { ReactNode } from "react";

type Props = {
  kind: "terminal" | "sheet";
  /** Short line above the artefact saying what it is. */
  label?: ReactNode;
  /** For terminals: the command that produced the output, shown as the first line. */
  request?: ReactNode;
  children: ReactNode;
  /** Usually a <Provenance>. */
  caption?: ReactNode;
  className?: string;
};

/**
 * A real artefact: a terminal block (fixed dark in both themes so the output
 * looks identical everywhere) or a plain paper sheet for a clipping.
 */
export function Exhibit({ kind, label, request, children, caption, className }: Props) {
  return (
    <figure className={["exhibit", `exhibit-${kind}`, className].filter(Boolean).join(" ")}>
      {label && <p className="exhibit-label">{label}</p>}
      {kind === "terminal" ? (
        <pre className="terminal" tabIndex={0}>
          <code>
            {request && (
              <span className="term-request">
                $ {request}
                {"\n"}
              </span>
            )}
            {children}
          </code>
        </pre>
      ) : (
        <div className="sheet">{children}</div>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
