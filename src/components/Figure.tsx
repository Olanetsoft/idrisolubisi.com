import { site } from "@/data/site";
import { Provenance } from "./Provenance";

/** The one number on the page, dated and sourced. */
export function Figure() {
  const f = site.figures.toolCalls;
  return (
    <section className="figure" aria-label="Tool calls served">
      <div className="container">
        <p className="figure-value" translate="no">
          {f.value}
        </p>
        <p className="figure-unit">
          <mark className="marker">{f.unit}</mark>
        </p>
        <p className="figure-text">
          Each one is a request from Claude, Cursor or Copilot asking my server to search a
          contract, compile Compact or read a page of docs on a developer’s behalf. Every number on
          this page is dated and linked.
        </p>
        <Provenance source={f.source} href={f.href} date={f.asOf} />
        <p className="note">{f.note}</p>
      </div>
    </section>
  );
}
