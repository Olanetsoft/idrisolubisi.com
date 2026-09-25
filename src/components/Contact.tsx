import { site } from "@/data/site";

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container section-grid">
        <h2 id="contact-title">Contact</h2>
        <div className="contact-lines">
          <p className="contact-intro">For roles, speaking or advising: book a call or email me.</p>
          <p>
            <a className="email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <p>
            <a href={site.bookingUrl}>Book a 15-min call</a>
          </p>
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
            </a>
            ,{" "}
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
