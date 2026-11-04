import Image from "next/image";
import { hero, slowSteps } from "@/data/hero";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { HeroBackdrop } from "./HeroBackdrop";
import { RichText } from "./RichText";
import { SlowStep } from "./SlowStep";
import { StatusLine } from "./StatusLine";

/** Only what the game shows, so the client code does not pull in the whole of projects.ts. */
const steps = slowSteps.map(({ key, step }) => {
  const { name, tagline } = projects.find((project) => project.key === key)!;
  return { key, step, name, line: tagline };
});

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
              <RichText
                text={hero.intro}
                wrapMark={(mark) => (
                  <a
                    className="slow-step-door"
                    href="#work"
                    role="button"
                    aria-haspopup="dialog"
                    data-slow-step
                  >
                    {mark}
                  </a>
                )}
              />
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
      <SlowStep steps={steps} />
    </section>
  );
}
