import Image from "next/image";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="hero" id="about" aria-labelledby="hero-title">
      <div className="container">
        <figure className="portrait-mobile">
          <Image
            src="/images/idris-portrait.jpg"
            alt="Idris Olubisi"
            width={1407}
            height={1600}
            sizes="96px"
            priority
          />
        </figure>
        <div className="hero-copy">
          <p className="status">{site.status}</p>
          <h1 id="hero-title">{site.name}</h1>
          <p className="disciplines" aria-label="Disciplines">
            {site.disciplines.map((d, i) => (
              <span key={d}>
                {i > 0 && (
                  <span className="sep" aria-hidden="true">
                    ·
                  </span>
                )}
                {d}
              </span>
            ))}
          </p>
          {site.bio.map((p) => (
            <p className="bio" key={p}>
              {p}
            </p>
          ))}
          <p className="availability">{site.availability}</p>
          <div className="actions">
            <a className="btn-primary" href={site.bookingUrl}>
              Book a 15-min call
            </a>
            <a href={site.resumeUrl}>CV (PDF)</a>
            <a href={`mailto:${site.email}`}>Email</a>
            <a href={site.links.linkedin} rel="me">
              LinkedIn
            </a>
          </div>
        </div>

        <ul className="numbers" aria-label="By the numbers">
          {site.numbers.map((n) => (
            <li key={n.label}>
              <span className="value">{n.value}</span>
              <span className="label">{n.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
