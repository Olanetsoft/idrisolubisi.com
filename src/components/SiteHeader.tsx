import Link from "next/link";
import { site } from "@/data/site";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

const social = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "X", href: site.links.x },
  { label: "Blog", href: site.links.blog },
  { label: "YouTube", href: site.links.youtube },
];

/**
 * On wide screens: the identity column (name, title, status, sections,
 * profiles). Below 1100px: a compact bar with a Menu button.
 */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-bar">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          {site.name}
        </Link>
        <div className="header-tools">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
      <div className="identity">
        <p>{site.role}</p>
        <p>London · available now</p>
      </div>
      <nav className="site-nav" aria-label="Sections">
        {site.nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <nav className="side-links" aria-label="Profiles">
        {social.map((l) => (
          <a key={l.href} href={l.href} rel="me">
            {l.label}
          </a>
        ))}
        <a href={`mailto:${site.email}`}>Email</a>
        <a href={site.resumeUrl}>CV</a>
      </nav>
    </header>
  );
}
