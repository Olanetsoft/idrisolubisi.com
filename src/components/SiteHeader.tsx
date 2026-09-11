import Link from "next/link";
import { site } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="masthead">
      <div className="container">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          {site.name}
          <small>
            {site.origin} → {site.location.split(",")[0]}
          </small>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {site.nav.map((item) =>
            "mono" in item && item.mono ? (
              <a key={item.href} href={item.href} className="nav-mono" translate="no">
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
