import { toolCategories, toolTotal } from "@/data/exhibits";
import { site } from "@/data/site";
import { Exhibit } from "./Exhibit";
import { Figure } from "./Figure";
import { Provenance } from "./Provenance";

function CategoriesResponse() {
  // The server's own response, abridged to name and toolCount per category.
  return (
    <>
      <span className="term-key">categories:</span>
      {"\n"}
      {toolCategories.categories.map((c) => (
        <span key={c.name}>
          {"  - "}
          <span className="term-key">name:</span> {c.name}
          {"\n"}
          {"    "}
          <span className="term-key">toolCount:</span> {c.toolCount}
          {"\n"}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const a = site.availability;
  return (
    <>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-claim">
          <p className="kicker">
            {site.name} · {site.role} · {site.location.split(",")[0]}
          </p>
          <h1 id="hero-title">
            The first developer to read your docs is now an AI agent. I built the server it calls.
          </h1>
          <p className="standfirst">
            Midnight MCP is an open-source server that lets Claude, Cursor and Copilot search a
            zero-knowledge codebase, compile Compact and read the documentation from inside the
            editor. It passed 10,000 downloads on npm and served more than 11,900 tool calls from
            agents, a channel that did not exist before I built it. Before that: cross-chain
            developer relations at Axelar for 100,000+ developers, Web3 Afrika, the community I
            founded in 2022 that now has 15,000+ builders, and freeCodeCamp tutorials read more than
            ten million times.
          </p>
          <dl className="needs">
            <dt>Looking for</dt>
            <dd>{a.lookingFor}.</dd>
            <dt>From</dt>
            <dd>{a.from}</dd>
            <dt>Right to work</dt>
            <dd>{a.rightToWork}</dd>
            <dt>Before this</dt>
            <dd>{a.before}</dd>
            <dt>CV</dt>
            <dd>
              <a href={site.resumeUrl}>Idris-Olubisi-CV-2026.pdf</a>, opens in the browser
            </dd>
          </dl>
        </div>

        <div className="hero-exhibit">
          <Exhibit
            kind="terminal"
            label="What an agent sees when it calls the server"
            request={toolCategories.request}
            caption={
              <Provenance
                source={toolCategories.server}
                href={toolCategories.source}
                date={toolCategories.capturedAt}
              >
                {toolTotal} tools in {toolCategories.categories.length} categories, response abridged
              </Provenance>
            }
          >
            <CategoriesResponse />
          </Exhibit>
        </div>
      </section>
      <Figure />
    </>
  );
}
