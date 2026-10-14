import Image from "next/image";
import { hero } from "@/data/hero";
import { site } from "@/data/site";
import { HeroBackdrop } from "./HeroBackdrop";
import { BrandIcon, UiIcon } from "./icons";
import { RichText } from "./RichText";
import { StatusLine } from "./StatusLine";

export function Hero() {
  return (
    <section className="hero" id="about" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <HeroBackdrop />
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
              <UiIcon name="fileText" size={17} />
              CV (PDF)
            </a>
            <a className="action-link" href={`mailto:${site.email}`}>
              <UiIcon name="envelope" size={17} />
              Email
            </a>
            <a className="action-link" href={site.links.linkedin} rel="me">
              <BrandIcon name="linkedin" size={17} />
              LinkedIn
            </a>
            <a className="action-link" href={site.links.github} rel="me">
              <BrandIcon name="github" size={17} />
              GitHub
            </a>
          </div>
          <dl className="focus hero-focus">
            {hero.focus.map((f, i) => (
              <div
                className="focus-card spot tilt"
                key={f.title}
                style={{ "--i": i } as React.CSSProperties}
              >
                <dt className="focus-title">
                  <span className="focus-index" aria-hidden="true">
                    <span className="focus-accent" />
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.title}
                </dt>
                <dd className="focus-text">{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
