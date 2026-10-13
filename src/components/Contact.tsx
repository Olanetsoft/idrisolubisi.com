import { site } from "@/data/site";
import { StatusLine } from "./StatusLine";
import { CopyButton } from "./CopyCommand";

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
          <p className="elsewhere">
            Also on{" "}
            <a href={site.links.linkedin} rel="me">
              LinkedIn
            </a>
            ,{" "}
            <a href={site.links.github} rel="me">
              GitHub
            </a>
            ,{" "}
            <a href={site.links.x} rel="me">
              X
            </a>{" "}
            (27,000+ followers),{" "}
            <a href={site.links.youtube} rel="me">
              YouTube
            </a>{" "}
            and{" "}
            <a href={site.links.blog} rel="me">
              my blog
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
