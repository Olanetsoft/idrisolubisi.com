import { githubStats, projects } from "@/data/projects";
import { site } from "@/data/site";
import { Reveal } from "./Reveal";
import { ArrowUpRight, Star } from "./Icons";

const formatStars = (n: number) => new Intl.NumberFormat("en-GB").format(n);

export function OpenSource() {
  return (
    <section className="section" id="open-source" aria-labelledby="oss-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="folio mono">
              <b>05</b> Open source &amp; products
            </p>
            <h2 id="oss-title">Things I&rsquo;ve shipped</h2>
          </div>
          <p>
            {githubStats.repos} repositories, {githubStats.stars} stars and {githubStats.followers}{" "}
            followers on{" "}
            <a className="link" href={site.links.github} rel="noopener">
              GitHub
            </a>
            , plus a couple of products with real users. Contributing since 2018 — Arctic Code Vault
            contributor.
          </p>
        </Reveal>

        <Reveal>
          <ul className="repo-grid">
            {projects.map((p) => {
              const inner = (
                <>
                  <p className="name">
                    <span>{p.name}</span>
                    {typeof p.stars === "number" ? (
                      <span className="stars">
                        <Star /> {formatStars(p.stars)}
                      </span>
                    ) : p.href ? (
                      <span className="stars" aria-hidden="true">
                        <ArrowUpRight />
                      </span>
                    ) : null}
                  </p>
                  <p>{p.description}</p>
                  <p className="stack">
                    {p.kind === "product" && <span className="badge">Product · </span>}
                    {p.stack ?? " "}
                  </p>
                </>
              );
              return (
                <li key={p.name} style={{ display: "contents" }}>
                  {p.href ? (
                    <a className="repo" href={p.href} rel="noopener">
                      {inner}
                    </a>
                  ) : (
                    <div className="repo">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
