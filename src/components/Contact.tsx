import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";

const links = [
  { label: "Book a 15-min call", href: site.bookingUrl, meta: "Google Calendar" },
  { label: "LinkedIn", href: site.links.linkedin, meta: "in/idris-olubisi" },
  { label: "GitHub", href: site.links.github, meta: "Olanetsoft" },
  { label: "X", href: site.links.x, meta: `@${site.handle}` },
  { label: "CV", href: site.resumeUrl, meta: "PDF" },
];

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container two-col">
        <div>
          <h2 id="contact-title">Contact</h2>
          <p className="section-intro">
            For roles, speaking or advising: book a call, email me, or send a message here. I reply
            to everything specific.
          </p>
          <p className="email-line">
            <a className="email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <ul className="link-list">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} rel="me">
                  {l.label}
                </a>
                <span className="meta">{l.meta}</span>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
