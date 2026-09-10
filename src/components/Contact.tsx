import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";

const links = [
  { label: "LinkedIn", href: site.links.linkedin, meta: "in/idris-olubisi" },
  { label: "X", href: site.links.x, meta: `@${site.handle}` },
  { label: "GitHub", href: site.links.github, meta: site.handle },
  { label: "Résumé", href: site.resumeUrl, meta: "PDF" },
];

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container contact">
        <Reveal>
          <p className="folio mono">
            <b>06</b> Contact
          </p>
          <h2 id="contact-title">
            Let&rsquo;s build something developers <em>actually adopt</em>.
          </h2>
          <p className="lede">
            I&rsquo;m currently open to senior developer relations, developer experience and
            AI-tooling roles — remote or London. Also happy to talk about speaking, writing and
            advising.
          </p>
          <div className="contact-links">
            {links.map((l) => (
              <a key={l.label} href={l.href} rel="me noopener">
                <span>{l.label}</span>
                <span className="mono">{l.meta}</span>
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
