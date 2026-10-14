import { site } from "@/data/site";
import { Bloom } from "./Bloom";

const SECTIONS = [
  { href: "/#work", label: "Projects" },
  { href: "/#talks", label: "Talks" },
  { href: "/#experience", label: "Experience" },
  { href: "/#writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

/** A short sitemap, his handles on pages without the Contact box, and when the site was last built. */
export function SiteFooter() {
  const now = new Date();
  const updated = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(now);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <nav className="footer-nav" aria-label="Footer">
            {SECTIONS.map((s) => (
              <a key={s.href} href={s.href}>
                {s.label}
              </a>
            ))}
            <a href={site.resumeUrl}>CV (PDF)</a>
          </nav>
          <p className="footer-handles">
            <a href={site.links.github} rel="me">
              github.com/Olanetsoft
            </a>
            <a href={site.links.x} rel="me">
              x.com/olanetsoft
            </a>
            <a href={site.links.blog} rel="me">
              blog.idrisolubisi.com
            </a>
          </p>
        </div>
        <div className="footer-meta">
          <p className="footer-copy">
            <span>
              <Bloom />© {now.getFullYear()} {site.name}
            </span>
            <span>Last updated {updated}</span>
            <a href="/llms.txt">llms.txt</a>
          </p>
          <p>
            <a href="#top">Back to top</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
