import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container section-grid">
        <h2 id="contact-title">Contact</h2>
        <div>
          <div className="contact-lines">
            <p className="section-intro">For roles, speaking or advising: book a call or email me.</p>
            <p>
              <a className="email" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
            <p>
              <a href={site.bookingUrl}>Book a 15-min call →</a>
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
