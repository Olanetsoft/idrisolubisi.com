import type { ReactNode } from "react";

type Props = {
  /** The stage it opens: a key of STAGES in src/lib/three-shell.ts. */
  stage: string;
  /** Where it goes as a plain link: a modified click, no script, no WebGL. */
  href: string;
  /** Its name for screen readers, which also names the stage. */
  label: string;
  /** The drawing, in a 44 by 44 box. Use .three-door-amber and .three-door-dot for the accents. */
  children: ReactNode;
};

/** A door to a three.js stage: a line drawing in the server HTML, and no script of its own. */
export function ThreeDoor({ stage, href, label, children }: Props) {
  return (
    <a
      className="three-door"
      href={href}
      role="button"
      aria-haspopup="dialog"
      aria-label={label}
      data-three={stage}
    >
      <svg viewBox="0 0 44 44" width="44" height="44" focusable="false" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
