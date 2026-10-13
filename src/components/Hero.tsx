import Image from "next/image";
import { site } from "@/data/site";
import { StatusLine } from "./StatusLine";
import { LensBio, LensLog, LensMetrics, LensSwitch, LensTitle } from "./HeroLens";

export function Hero() {
  return (
    <section className="hero" id="about" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid">
          <StatusLine />
          <div className="hero-id">
            <h1 id="hero-title">{site.name}</h1>
            <LensTitle />
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
            <LensBio />
          </div>
          <LensSwitch />
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
          <div className="hero-metrics">
            <LensMetrics />
          </div>
          <LensLog />
        </div>
      </div>
    </section>
  );
}
