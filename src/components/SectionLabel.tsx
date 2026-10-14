import type { ReactNode } from "react";

/**
 * The mono "[ 01 / 06 ] PROJECTS" label. It links to its own section, so a
 * reader can copy a deep link such as /#experience; a # shows on hover.
 */
export function SectionLabel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 className="label" id={`${id}-title`}>
      <a className="label-link" href={`#${id}`}>
        <span className="label-index" aria-hidden="true" />
        {children}
        <span className="label-hash" aria-hidden="true">
          #
        </span>
      </a>
    </h2>
  );
}
