import { site } from "@/data/site";
import { articles, platforms, press } from "@/data/writing";
import { Reveal } from "./Reveal";
import { ArrowUpRight } from "./Icons";

export function Writing() {
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="folio mono">
              <b>04</b> Writing &amp; press
            </p>
            <h2 id="writing-title">Read by ten million developers</h2>
          </div>
          <p>
            Forty-plus tutorials on the platforms developers already trust, and profiles by the
            outlets that cover African tech. The writing is how most people meet me before we ever
            talk.
          </p>
        </Reveal>

        <div className="writing">
          <Reveal>
            <div className="col-head mono">
              <span>Press</span>
              <span>Independent coverage</span>
            </div>
            <ul className="press-list">
              {press.map((p) => (
                <li key={p.href}>
                  <a className="press-item" href={p.href} rel="noopener">
                    <p className="outlet mono">
                      <span>
                        {p.outlet}
                        {p.disclosure && <span className="disclosure"> · {p.disclosure}</span>}
                      </span>
                      <span>{p.date}</span>
                    </p>
                    <p className="headline">{p.headline}</p>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="col-head mono">
              <span>Selected articles</span>
              <a href={site.links.blog} rel="noopener" className="arrow-link">
                All writing <ArrowUpRight />
              </a>
            </div>
            <ul className="article-list">
              {articles.map((a) => (
                <li key={a.href}>
                  <a className="article-item" href={a.href} rel="noopener">
                    <p className="outlet mono">
                      <span>{a.outlet}</span>
                      {a.note && <span>{a.note}</span>}
                    </p>
                    <p className="headline">{a.title}</p>
                  </a>
                </li>
              ))}
            </ul>
            <p className="platforms">
              Published on{" "}
              {platforms.map((p, i) => (
                <span key={p}>
                  {p}
                  {i < platforms.length - 1 ? ", " : ""}
                </span>
              ))}{" "}
              — and 40+ tutorials with 200,000+ annual readers on{" "}
              <a className="link" href={site.links.blog} rel="noopener">
                blog.idrisolubisi.com
              </a>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
