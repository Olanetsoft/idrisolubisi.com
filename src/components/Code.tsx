import { installLine } from "@/data/exhibits";
import { projects, starsFetchedAt } from "@/data/projects";
import { site } from "@/data/site";
import { firstLines } from "@/lib/llms";
import { CopyLine } from "./CopyLine";
import { Exhibit } from "./Exhibit";
import { Provenance } from "./Provenance";

const format = (n: number) => new Intl.NumberFormat("en-GB").format(n);

export function Code() {
  const [mcp, ...rest] = projects;
  const llms = firstLines(40);
  return (
    <section className="section" id="code" aria-labelledby="code-title">
      <div className="container">
        <h2 id="code-title">Code</h2>

        <div className="code-lead">
          <p className="code-name" translate="no">
            <a href={mcp.href}>{mcp.name}</a>
          </p>
          <CopyLine command={installLine} />
          <p>
            {mcp.description} {mcp.status}
          </p>
          <Provenance source="npm" href={site.figures.downloads.href} date={starsFetchedAt}>
            {site.figures.downloads.value} downloads · {format(mcp.stars ?? 0)} stars on GitHub
          </Provenance>
        </div>

        <ul className="code-list">
          {rest.map((p) => (
            <li key={p.name}>
              <p className="code-name" translate="no">
                {p.href ? <a href={p.href}>{p.name}</a> : p.name}
                {p.kind === "product" && <span className="meta"> product</span>}
              </p>
              <p>{p.description}</p>
              {(typeof p.stars === "number" || p.note) && (
                <Provenance source="GitHub" href={p.href} date={starsFetchedAt}>
                  {[typeof p.stars === "number" ? `${format(p.stars)} stars` : null, p.note]
                    .filter(Boolean)
                    .join(" · ")}
                </Provenance>
              )}
            </li>
          ))}
        </ul>

        <p className="intro">
          This site is readable by your agent. The text below is generated from the same data as
          the page you are reading; the full file is at{" "}
          <a href="/llms.txt" className="nav-mono" translate="no">
            /llms.txt
          </a>
          .
        </p>
        <Exhibit
          kind="terminal"
          request={
            <>
              curl -s {site.url}
              <mark className="marker">/llms.txt</mark> | head -40
            </>
          }
          caption={
            <Provenance source="src/data" href={site.links.source}>
              generated at build, same bytes as /llms.txt
            </Provenance>
          }
        >
          {llms}
        </Exhibit>
      </div>
    </section>
  );
}
