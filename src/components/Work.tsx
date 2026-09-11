import Link from "next/link";
import { caseStudies, type CaseStudy } from "@/data/case-studies";
import { axelarCommands, toolNames } from "@/data/exhibits";
import { press } from "@/data/writing";
import { Exhibit } from "./Exhibit";
import { OutputLine } from "./OutputLine";
import { Provenance } from "./Provenance";

const blockfest = press.find((p) => p.headline.startsWith("Blockfest Africa 2025"));

export function WorkExhibit({ kind }: { kind: CaseStudy["exhibit"] }) {
  if (kind === "toolCategories") {
    return (
      <Exhibit
        kind="terminal"
        label="The tools an agent is offered"
        request="tools/list"
        caption={
          <Provenance source="midnight-mcp" href={toolNames.source} date={toolNames.capturedAt}>
            8 of 31 tool names
          </Provenance>
        }
      >
        {toolNames.names.map((n) => (
          <span key={n}>
            {n}
            {"\n"}
          </span>
        ))}
      </Exhibit>
    );
  }
  if (kind === "axelarCommands") {
    return (
      <Exhibit
        kind="terminal"
        label="The first five commands in the README"
        caption={
          <Provenance
            source="foundry-axelar-gmp-example"
            href={axelarCommands.source}
            date={axelarCommands.capturedAt}
          >
            57 of 59 commits are mine
          </Provenance>
        }
      >
        {axelarCommands.lines.map((l) => (
          <span key={l}>
            <span className="term-prompt">$ </span>
            {l}
            {"\n"}
          </span>
        ))}
      </Exhibit>
    );
  }
  if (!blockfest) return null;
  return (
    <Exhibit
      kind="sheet"
      label="The headline"
      caption={
        <Provenance source={blockfest.outlet} href={blockfest.href} date={blockfest.date} />
      }
    >
      <blockquote className="sheet-quote" cite={blockfest.href}>
        <p>“{blockfest.headline}”</p>
      </blockquote>
    </Exhibit>
  );
}

export function Work() {
  const rows = caseStudies.filter((c) => c.showOnHome !== false);
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <h2 id="work-title">Work</h2>
        <p className="intro">
          Three things I built, each with the artefact, the output and the part most teams skip.
        </p>
        <ol className="ledger">
          {rows.map((cs) => (
            <li className="ledger-row" key={cs.slug}>
              <div className="claim">
                <p className="meta">
                  {cs.org} · {cs.role} · {cs.period}
                </p>
                <h3>
                  <Link href={`/work/${cs.slug}`}>{cs.title}</Link>
                </h3>
                <p>{cs.story}</p>
                {cs.status && <p className="status">{cs.status}</p>}
                <OutputLine output={cs.output} />
                <p className="note">{cs.skipped}</p>
              </div>
              <div className="exhibit-col">
                <WorkExhibit kind={cs.exhibit} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
