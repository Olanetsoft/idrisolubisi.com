import Image from "next/image";
import { site } from "@/data/site";
import { featuredIn, press } from "@/data/writing";
import { ArrowRight } from "./Icons";

export function Hero() {
  return (
    <>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker mono">
            <span className="dot" aria-hidden="true" />
            <span>Senior Developer Relations Engineer</span>
            <span aria-hidden="true">·</span>
            <span>AI Engineer</span>
            <span aria-hidden="true">·</span>
            <span>London</span>
          </p>
          <h1 className="hero-title" id="hero-title">
            I help developers — and their <em>AI agents</em> — adopt hard technology.
          </h1>
          <p className="hero-lede">
            Five years of developer relations across zero-knowledge, cross-chain and AI
            infrastructure. I build the tooling, documentation and communities that turn a curious
            developer into a shipped integration. Founder of Web3 Afrika; freeCodeCamp author read
            by more than ten million developers.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#work">
              See the work
              <ArrowRight />
            </a>
            <a className="btn btn-ghost" href={site.resumeUrl} download>
              Download résumé
            </a>
          </div>
          <p className="hero-meta mono">
            <span>{site.availability}</span>
            <span>UK Global Talent visa</span>
          </p>
        </div>

        <figure className="hero-figure">
          <div className="frame">
            <Image
              src="/images/idris-portrait.jpg"
              alt="Idris Olubisi, arms crossed and smiling, in a black leather jacket against a white studio backdrop."
              width={1407}
              height={1600}
              priority
              sizes="(max-width: 860px) 360px, 440px"
            />
          </div>
          <figcaption className="mono">
            <span>{site.name}</span>
            <span>Photograph — {site.photoCredit}</span>
          </figcaption>
        </figure>
      </section>

      <div className="container">
        <ul className="metrics" aria-label="Career metrics">
          {site.metrics.map((m) => (
            <li className="metric" key={m.label}>
              <div className="value">{m.value}</div>
              <div className="label">{m.label}</div>
            </li>
          ))}
        </ul>

        <div className="featured">
          <span className="mono">Featured in</span>
          <ul>
            {featuredIn.map((outlet) => {
              const item = press.find((p) => p.outlet === outlet);
              return (
                <li key={outlet}>
                  {item ? (
                    <a href={item.href} rel="noopener">
                      {outlet}
                    </a>
                  ) : (
                    outlet
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
