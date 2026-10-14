import type { ReactNode } from "react";

/** Renders [label](url) as links and ==text== as a highlighted <mark>. */
export function RichText({ text }: { text: string }): ReactNode {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|==([^=]+)==/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(
        <a key={match.index} href={match[2]}>
          {match[1]}
        </a>,
      );
    } else {
      nodes.push(<mark key={match.index}>{match[3]}</mark>);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
