import Link from "next/link";
import { site } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="wordmark" aria-label={`${site.name} — home`}>
          {site.name}
          <small>@{site.handle}</small>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="btn btn-ghost" href={site.resumeUrl} download>
            Résumé
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 4v12M6 10l6 6 6-6M4 20h16" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
