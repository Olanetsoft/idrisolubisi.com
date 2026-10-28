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
          <p className="lede">Tutorials read {writingStats.reads} times.</p>
          <p className="lede-sub published-on">
            <span className="published-label">Published on</span> {platforms.join(", ")}
          </p>
        </div>
        <ul className="row-list row-list--dated">
          {writingList(blogPosts).map((a) => (
            <li className="row-item" key={a.href}>
              <p className="card-kicker">
                <time dateTime={a.date}>{monthYear(a.date)}</time>
                <span aria-hidden="true">·</span>
                {a.outlet}
              </p>
              <h3 className="card-title">
                <a className="card-link" href={a.href}>
                  {a.title}
                </a>
              </h3>
            </li>
          ))}
        </ul>
        <p className="more-link more-links">
          <a href={site.links.blog}>All posts on blog.idrisolubisi.com</a>
          <a href={site.links.freecodecamp} rel="me">
            freeCodeCamp
          </a>
          <a href={site.links.devto} rel="me">
            Dev.to
          </a>
          <a href={site.links.logrocket}>LogRocket</a>
          <a href={site.links.medium} rel="me">
            Medium
          </a>
        </p>
      </div>
    </section>
  );
}
