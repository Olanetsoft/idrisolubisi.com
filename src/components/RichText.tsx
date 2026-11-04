import { Fragment, type ReactNode } from "react";

/**
 * Renders [label](url) as links and ==text== as a highlighted <mark>.
 * `wrapMark` puts something around that <mark>: the Hero's door.
 */
export function RichText({
  text,
  wrapMark,
}: {
  text: string;
  wrapMark?: (mark: ReactNode) => ReactNode;
}): ReactNode {
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
      const mark = <mark>{match[3]}</mark>;
      nodes.push(<Fragment key={match.index}>{wrapMark ? wrapMark(mark) : mark}</Fragment>);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
