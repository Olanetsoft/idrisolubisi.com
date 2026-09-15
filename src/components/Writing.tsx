import { site } from "@/data/site";
import { articles, platforms, writingStats } from "@/data/writing";

export function Writing() {
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 id="writing-title">Writing</h2>
            <p className="section-intro">
              {writingStats.tutorials} tutorials read {writingStats.reads} times across{" "}
              {platforms.slice(0, 4).join(", ")} and others; {writingStats.monthly}.
            </p>
          </div>
          <a className="see-all" href={site.links.blog}>
            All posts →
          </a>
        </div>
        <ul className="article-list">
          {articles.map((a) => (
            <li key={a.href}>
              <a href={a.href}>{a.title}</a>
              <span className="meta">
                {a.outlet}
                {a.note && ` · ${a.note}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
