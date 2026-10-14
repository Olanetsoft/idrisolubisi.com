import { site } from "@/data/site";
import { BrandLink, MobileMenu, SiteNav } from "./SiteNav";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <BrandLink name={site.name} />
        <SiteNav />
        <div className="site-header-actions">
          <ThemeToggle />
          <MobileMenu />
          <a className="header-cta" href={site.bookingUrl}>
            Book a call
          </a>
        </div>
      </div>
    </header>
  );
}
