import { Fragment } from "react";
import { site } from "@/data/site";
import { MERKLE_POST, platforms, writingList, writingStats } from "@/data/writing";
import { monthYear } from "@/lib/format";
import { blogPosts } from "@/lib/generated";
import { ArticleRow } from "./ListRows";
import { LooseLeafDoor } from "./LooseLeafDoor";
import { SectionLabel } from "./SectionLabel";

export function Writing() {
  const list = writingList(blogPosts);
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="writing">Writing</SectionLabel>
          <p className="lede">Tutorials read {writingStats.reads} times.</p>
          <p className="lede-sub published-on">
            <span className="published-label">Published on</span>{" "}
            {platforms.map((p, i) => (
              <Fragment key={p.name}>
                {i > 0 && ", "}
                {p.href ? <a href={p.href}>{p.name}</a> : p.name}
              </Fragment>
            ))}
          </p>
        </div>
        <ul className="row-list row-list--dated">
          {list.map((a) => (
            <ArticleRow
              key={a.href}
              date={a.date}
              month={monthYear(a.date)}
              outlet={a.outlet}
              href={a.href}
              title={a.title}
            >
              {a.href === MERKLE_POST && <LooseLeafDoor href={a.href} />}
            </ArticleRow>
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
