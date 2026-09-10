import Image from "next/image";
import { site } from "@/data/site";
import { speakingTopics, talks } from "@/data/talks";
import { Reveal } from "./Reveal";
import { ArrowUpRight, Play } from "./Icons";

export function Speaking() {
  return (
    <section className="section" id="speaking" aria-labelledby="speaking-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="folio mono">
              <b>02</b> Speaking
            </p>
            <h2 id="speaking-title">On stage, in person and on camera</h2>
          </div>
          <p>
            Keynotes, conference talks and workshops from Lagos to Paris — on agent-era developer
            experience, zero-knowledge proofs, cross-chain applications and building developer
            communities where none existed.
          </p>
        </Reveal>

        <div className="speaking">
          <Reveal>
            <figure className="stage">
              <a href={site.links.youtube} rel="noopener" aria-label="Watch talks on the YouTube playlist">
                <div className="frame">
                  <Image
                    src="/images/idris-speaking-build-afrika.jpg"
                    alt="Idris Olubisi speaking on stage at the Build Afrika Summit in Lagos to a full room of developers."
                    width={1800}
                    height={1440}
                    sizes="(max-width: 860px) 100vw, 560px"
                  />
                  <span className="play">
                    <Play /> Watch the talks
                  </span>
                </div>
              </a>
              <figcaption className="mono">
                <span>Build Afrika Summit, Lagos</span>
                <span>2025</span>
              </figcaption>
            </figure>

            <div className="topics">
              <h3>Talks I give</h3>
              <ul>
                {speakingTopics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="speaking-cta">
              <a className="btn" href="#contact">
                Invite me to speak
              </a>
              <a className="btn btn-ghost" href={site.links.sessionize} rel="noopener">
                Sessionize profile <ArrowUpRight />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="talk-list" aria-label="Selected talks">
              {talks.map((t) => (
                <li className="talk" key={`${t.event}-${t.title}`}>
                  <span className="year mono">{t.year ?? "—"}</span>
                  <div>
                    <p className="event">
                      <b>{t.event}</b>
                      {t.location && <span className="muted">{t.location}</span>}
                      <span className="kind">{t.kind}</span>
                    </p>
                    <p className="title">
                      {t.href ? (
                        <a href={t.href} rel="noopener" className="link">
                          {t.title}
                        </a>
                      ) : (
                        t.title
                      )}
                    </p>
                    {t.note && <p className="note">{t.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
