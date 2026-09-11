import Link from "next/link";
import { site } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          {site.name}
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
