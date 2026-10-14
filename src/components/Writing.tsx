import { site } from "@/data/site";
import { platforms, writingList, writingStats } from "@/data/writing";
import { monthYear } from "@/lib/format";
import { blogPosts } from "@/lib/generated";
import { SectionLabel } from "./SectionLabel";

export function Writing() {
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="writing">Writing</SectionLabel>
          <p className="lede">
            {writingStats.tutorials} tutorials, read {writingStats.reads} times.
          </p>
          <p className="lede-sub published-on">
            <span className="published-label">Published on</span> {platforms.join(", ")}
          </p>
        </div>
        <div className="box">
          <ul className="rows">
            {writingList(blogPosts).map((a) => (
              <li className="row" key={a.href}>
                <p className="row-label">
                  <time dateTime={a.date}>{monthYear(a.date)}</time>
                </p>
                <div className="row-body">
                  <p className="title">
                    <a href={a.href}>{a.title}</a>
                  </p>
                  <p className="meta">
                    {a.outlet}
                    {a.note && ` · ${a.note}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="row-more">
            <a href={site.links.blog}>All posts on blog.idrisolubisi.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}
