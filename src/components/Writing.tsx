import { site } from "@/data/site";
import { articles, press } from "@/data/writing";

export function Writing() {
  return (
    <section className="section" id="writing" aria-labelledby="writing-title">
      <div className="container two-col">
        <div>
          <h2 id="writing-title">Writing</h2>
          <p className="section-intro">
            Selected tutorials. More on <a href={site.links.blog}>blog.idrisolubisi.com</a> and{" "}
            <a href={site.links.freecodecamp}>freeCodeCamp</a>.
          </p>
          <ul className="link-list">
            {articles.map((a) => (
              <li key={a.href}>
                <a href={a.href}>{a.title}</a>
                <span className="meta">{a.outlet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Press</h2>
          <p className="section-intro">Coverage of my work and of Web3 Afrika.</p>
          <ul className="link-list">
            {press.map((p) => (
              <li key={p.href}>
                <a href={p.href}>{p.headline}</a>
                <span className="meta">
                  {p.outlet}, {p.date}
                  {!p.independent && " (brand press)"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
