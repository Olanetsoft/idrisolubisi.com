import Link from "next/link";
import { site } from "@/data/site";
import { articles, press, writingProvenance } from "@/data/writing";
import { Clipping } from "./Clipping";
import { Provenance } from "./Provenance";

export function Writing() {
  const clips = press.filter((p) => p.clip);
  const rest = press.filter((p) => !p.clip);
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container">
        <h2 id="writing-title">Writing and press</h2>

        <div className="clippings">
          {clips.map((p) => (
            <Clipping item={p} key={p.href} />
          ))}
        </div>

        <ul className="plain-list press-list" aria-label="More coverage">
          {rest.map((p) => (
            <li key={p.href}>
              <a href={p.href}>{p.headline}</a>
              <span className="meta">
                {" "}
                {p.outlet}, {p.date}
                {!p.independent && ", brand press"}
              </span>
            </li>
          ))}
        </ul>

        <p className="intro">
          Every tutorial started as a question a developer asked me in a Discord, at a workshop or
          in a GitHub issue. Together they have been read more than ten million times; freeCodeCamp
          alone sees 100,000+ views a month.
        </p>
        <ul className="plain-list article-list" aria-label="Selected articles">
          {articles.map((a) => (
            <li key={a.href}>
              <a href={a.href}>{a.title}</a>
              <span className="meta">
                {" "}
                {a.outlet}
                {a.note && `, ${a.note}`}
              </span>
            </li>
          ))}
        </ul>
        <Provenance
          source={writingProvenance.source}
          href={writingProvenance.href}
          date={writingProvenance.asOf}
        >
          {writingProvenance.items.join(" · ")}
        </Provenance>
        <p className="after">
          More on <a href={site.links.blog}>blog.idrisolubisi.com</a>, and the{" "}
          <Link href="/work/technical-writing-ten-million-views">writing case study</Link>.
        </p>
      </div>
    </section>
  );
}
