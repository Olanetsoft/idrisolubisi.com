import type { Output } from "@/data/case-studies";

type Props = { output: Output; mark?: boolean };

/** The measured result of a piece of work, ending with where and when it was checked. */
export function OutputLine({ output, mark = true }: Props) {
  return (
    <p className="output">
      <b>Output:</b>{" "}
      {output.items.map((item, i) => (
        <span key={item}>
          {i > 0 && " · "}
          {mark && output.mark === i ? <mark className="marker">{item}</mark> : item}
        </span>
      ))}
      {" · "}
      <a href={output.href}>{output.source}</a> · {output.asOf}
    </p>
  );
}
