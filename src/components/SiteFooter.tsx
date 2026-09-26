import { site } from "@/data/site";
import { Bloom } from "./Bloom";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          <Bloom />© {year} {site.name} · <a href="/llms.txt">llms.txt</a>
        </p>
      </div>
    </footer>
  );
}
