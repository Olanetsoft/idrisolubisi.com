import { projects, starsFetchedAt } from "@/data/projects";

const format = (n: number) => new Intl.NumberFormat("en-GB").format(n);

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <h2 id="projects-title">Selected projects</h2>
        <p className="section-intro">
          Open-source tooling and products I have built and maintained. Star counts as of{" "}
          {starsFetchedAt}.
        </p>
        <ul className="project-grid">
          {projects.map((p) => (
            <li className="card" key={p.name}>
              <h3>{p.href ? <a href={p.href}>{p.name}</a> : p.name}</h3>
              <p>{p.description}</p>
              {p.status && <p className="status">{p.status}</p>}
              <p className="meta">
                {p.kind === "product" ? "Product" : "Open source"}
                {typeof p.stars === "number" && ` · ${format(p.stars)} stars`}
                {p.note && ` · ${p.note}`}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
