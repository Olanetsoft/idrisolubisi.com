import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Contributions } from "./Contributions";

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head">
          <h2 id="projects-title">Selected projects</h2>
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
              <p className="meta">{p.kind === "product" ? "Product" : "Open source"}</p>
            </li>
          ))}
        </ul>
        <Contributions />
      </div>
    </section>
  );
}
