import contributions from "@/data/github-contributions.json";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const format = (n: number) => new Intl.NumberFormat("en-GB").format(n);

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container section-grid">
        <h2 id="projects-title">Selected projects</h2>
        <ul className="rows">
          {projects.slice(0, 6).map((p) => (
            <li className="row" key={p.name}>
              <p className="row-label">{p.kind === "product" ? "Product" : "Open source"}</p>
              <div className="row-body">
                <p className="title">{p.href ? <a href={p.href}>{p.name}</a> : <strong>{p.name}</strong>}</p>
                <p>{p.description}</p>
                {p.status && <p className="note">{p.status}</p>}
              </div>
            </li>
          ))}
          <li className="row-more">
            <a href={site.links.github}>All repositories →</a>
            <span className="meta"> · {format(contributions.total)} contributions on GitHub in the last year</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
