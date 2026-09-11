import Image from "next/image";
import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";

const links = [
  { label: "LinkedIn", href: site.links.linkedin, meta: "in/idris-olubisi" },
  { label: "X", href: site.links.x, meta: `@${site.handle}` },
  { label: "GitHub", href: site.links.github, meta: "Olanetsoft" },
  { label: "CV", href: site.resumeUrl, meta: "Idris-Olubisi-CV-2026.pdf" },
];

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container contact">
        <div className="contact-claim">
          <h2 id="contact-title">Contact</h2>
          <p className="intro">
            Send me the onboarding problem your developers, or their agents, keep getting stuck on.
            I read everything and reply to anything specific.
          </p>
          {site.email && (
            <a className="email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          )}
          <ul className="contact-links">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} rel="me">
                  {l.label}
                </a>
                <span className="meta"> {l.meta}</span>
              </li>
            ))}
          </ul>
          <figure className="portrait">
            <Image
              src="/images/idris-portrait.jpg"
              alt="Idris Olubisi"
              width={1407}
              height={1600}
              sizes="160px"
            />
          </figure>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
