import type { ReactNode } from "react";

/** Renders text with [label](url) spans as links. */
export function RichText({ text }: { text: string }): ReactNode {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/);
  const nodes: ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    nodes.push(parts[i]);
    if (i + 1 < parts.length) {
      nodes.push(
        <a key={i} href={parts[i + 2]}>
          {parts[i + 1]}
        </a>,
      );
    }
  }
  return nodes;
}
