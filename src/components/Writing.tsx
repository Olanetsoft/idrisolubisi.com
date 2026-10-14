import { site } from "@/data/site";
import { articles, writingStats } from "@/data/writing";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2022-01" becomes "Jan 2022", the same month style as the experience dates. */
function monthYear(date: string): string {
  const [year, month] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function Writing() {
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container">
        <div className="section-head">
          <h2 className="label" id="writing-title">
            <span className="label-index" aria-hidden="true" />
            Writing
          </h2>
          <p className="lede">
            {writingStats.tutorials} tutorials, read {writingStats.reads} times.
          </p>
        </div>
        <div className="box">
          <ul className="rows">
            {articles.map((a) => (
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
            <a href={site.links.blog}>All posts</a>
          </p>
        </div>
      </div>
    </section>
  );
}
