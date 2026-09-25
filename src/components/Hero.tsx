import Image from "next/image";
import { site } from "@/data/site";
import { RichText } from "./RichText";

export function Hero() {
  return (
    <section className="hero" id="about" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
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
                <RichText text={p} />
              </p>
            ))}
            <p className="availability">{site.availability}</p>
            <div className="actions">
              <a href={site.bookingUrl}>Book a 15-min call</a>
              <a href={site.resumeUrl}>CV (PDF)</a>
              <a href={`mailto:${site.email}`}>Email</a>
              <a href={site.links.linkedin} rel="me">
                LinkedIn
              </a>
            </div>
          </div>
          <figure className="portrait">
            <Image
              src="/images/idris-portrait.jpg"
              alt="Idris Olubisi"
              width={1407}
              height={1600}
              priority
              sizes="(max-width: 860px) 128px, 220px"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
