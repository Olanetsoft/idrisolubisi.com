import { projects, starsFetchedAt } from "@/data/projects";
import { site } from "@/data/site";
import { Contributions } from "./Contributions";

const format = (n: number) => new Intl.NumberFormat("en-GB").format(n);

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 id="projects-title">Projects</h2>
            <p className="section-intro">
              Open-source tooling and products I have built and maintained. Star counts as of{" "}
              {starsFetchedAt}.
            </p>
          </div>
          <a className="see-all" href={site.links.github}>
            All repositories →
          </a>
        </div>
        <ul className="project-grid">
          {projects.slice(0, 6).map((p) => (
            <li className="card" key={p.name}>
              <h3>{p.href ? <a href={p.href}>{p.name}</a> : p.name}</h3>
              <p>{p.description}</p>
              {p.status && <p className="status-note">{p.status}</p>}
              <p className="meta">
                {p.kind === "product" ? "Product" : "Open source"}
                {typeof p.stars === "number" && ` · ${format(p.stars)} stars`}
                {p.note && ` · ${p.note}`}
              </p>
            </li>
          ))}
        </ul>
        <Contributions />
      </div>
    </section>
  );
}
