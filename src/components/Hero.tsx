import Image from "next/image";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="hero" id="about" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <figure className="portrait">
          <Image
            src="/images/idris-portrait.jpg"
            alt="Idris Olubisi"
            width={1407}
            height={1600}
            priority
            sizes="(max-width: 760px) 120px, 176px"
          />
        </figure>
        <div className="hero-copy">
          <h1 id="hero-title">{site.name}</h1>
          <p className="role">
            {site.role} · {site.location.split(",")[0]}
          </p>
          <p className="tagline">{site.tagline}</p>
          {site.bio.map((p) => (
            <p className="bio" key={p}>
              {p}
            </p>
          ))}
          <p className="availability">{site.availability}</p>
          <div className="actions">
            <a className="btn btn-primary" href={site.resumeUrl}>
              Download CV
            </a>
            <a className="btn" href={site.links.linkedin} rel="me">
              LinkedIn
            </a>
            <a className="btn" href={site.links.github} rel="me">
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="container">
        <ul className="highlights" aria-label="Highlights">
          {site.highlights.map((h) => (
            <li key={h.label}>
              <span className="value">{h.value}</span>
              <span className="label">{h.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
