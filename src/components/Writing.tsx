import { site } from "@/data/site";
import { articles, writingStats } from "@/data/writing";

export function Writing() {
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container section-grid">
        <h2 id="writing-title">Selected writing</h2>
        <div>
          <p className="section-intro">
            {writingStats.tutorials} tutorials, read {writingStats.reads} times.
          </p>
          <ul className="rows">
            {articles.map((a) => (
              <li className="row" key={a.href}>
                <p className="row-label">{a.outlet}</p>
                <div className="row-body">
                  <p className="title">
                    <a href={a.href}>{a.title}</a>
                  </p>
                </div>
              </li>
            ))}
            <li className="row-more">
              <a href={site.links.blog}>All posts →</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
