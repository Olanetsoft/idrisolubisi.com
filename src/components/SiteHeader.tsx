import { site } from "@/data/site";
import { BrandLink, MobileMenu, SiteNav } from "./SiteNav";
import { ThemeToggle } from "./ThemeToggle";

/** One hairline segment per numbered section (see .trace in globals.css). */
const TRACE_SEGMENTS = 6;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <div className="brand-lockup">
          <span className="header-live" aria-hidden="true" />
          <BrandLink name={site.name} />
        </div>
        <SiteNav />
        <div className="site-header-actions">
          <ThemeToggle />
          <MobileMenu />
          <a className="header-cta" href={site.bookingUrl}>
            Book a call
          </a>
        </div>
      </div>
      <div className="trace" aria-hidden="true">
        {Array.from({ length: TRACE_SEGMENTS }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </header>
  );
}
