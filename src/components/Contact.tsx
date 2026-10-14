import { site } from "@/data/site";
import { StatusLine } from "./StatusLine";
import { CopyButton } from "./CopyCommand";
import { BrandIcon, type BrandName } from "./icons";

const SOCIALS: { label: string; href: string; icon: BrandName; note?: string }[] = [
  { label: "LinkedIn", href: site.links.linkedin, icon: "linkedin" },
  { label: "GitHub", href: site.links.github, icon: "github" },
  { label: "X", href: site.links.x, icon: "x", note: "27,000+ followers" },
  { label: "YouTube", href: site.links.youtube, icon: "youtube" },
  { label: "Blog", href: site.links.blog, icon: "hashnode" },
];

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-head">
          <h2 className="label" id="contact-title">
            <span className="label-index" aria-hidden="true" />
            Contact
          </h2>
          <p className="lede">For roles, speaking or advising.</p>
        </div>
        <div className="box contact-box">
          <StatusLine />
          <p className="availability">{site.availability}</p>
          <div className="contact-actions">
            <a className="btn btn--primary" href={site.bookingUrl}>
              Book a 15-min call
            </a>
            <p className="contact-email">
              <a className="email" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <CopyButton value={site.email} label="Copy email address" />
            </p>
          </div>
          <ul className="socials" aria-label="Elsewhere">
            {SOCIALS.map((link) => (
              <li key={link.label}>
                <a href={link.href} rel="me">
                  <BrandIcon name={link.icon} size={18} />
                  <span>{link.label}</span>
                  {link.note && <span className="social-note">{link.note}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
