import Image from "next/image";
import { hero } from "@/data/hero";
import { site } from "@/data/site";
import { ActivityLog } from "./ActivityLog";
import { RichText } from "./RichText";
import { StatusLine } from "./StatusLine";

export function Hero() {
  return (
    <section className="hero" id="about" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid">
          <StatusLine />
          <div className="hero-id">
            <h1 id="hero-title">{site.name}</h1>
            {hero.headline && <p className="headline">{hero.headline}</p>}
          </div>
          <figure className="portrait">
            <Image
              src="/images/idris-portrait.jpg"
              alt="Idris Olubisi"
              width={1407}
              height={1600}
              priority
              sizes="(max-width: 1023px) 133px, 200px"
            />
          </figure>
          <div className="hero-pitch">
            <p className="pitch">
              <RichText text={hero.intro} />
            </p>
          </div>
          <div className="actions">
            <a className="btn btn--primary" href={site.bookingUrl}>
              Book a 15-min call
            </a>
            <a className="btn" href={site.resumeUrl}>
              CV (PDF)
            </a>
            <a className="action-link" href={`mailto:${site.email}`}>
              Email
            </a>
            <a className="action-link" href={site.links.linkedin} rel="me">
              LinkedIn
            </a>
            <a className="action-link" href={site.links.github} rel="me">
              GitHub
            </a>
          </div>
          <dl className="metrics hero-metrics">
            {hero.metrics.map((m) => (
              <div className="metric" key={m.caption}>
                <dt className="metric-source">{m.source}</dt>
                <dd className="metric-value">
                  {m.href ? (
                    <a href={m.href}>
                      {m.value}
                      <span className="sr-only"> {m.caption}</span>
                    </a>
                  ) : (
                    m.value
                  )}
                </dd>
                <dd className="metric-caption">{m.caption}</dd>
              </div>
            ))}
          </dl>
          <ActivityLog lines={hero.log} />
        </div>
      </div>
    </section>
  );
}
