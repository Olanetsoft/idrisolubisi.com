import Image from "next/image";
import { hero } from "@/data/hero";
import { site } from "@/data/site";
import { HeroBackdrop } from "./HeroBackdrop";
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
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 759px) 168px, (max-width: 1023px) 235px, 300px"
            />
          </figure>
          <div className="hero-pitch">
            <p className="pitch">
              <RichText text={hero.intro} />
            </p>
          </div>
          <div className="actions">
            <a className="btn btn--primary" href={site.bookingUrl}>
              Book a 30-min call
            </a>
            <a className="btn" href={site.resumeUrl}>
              CV (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
