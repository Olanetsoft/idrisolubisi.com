import { site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          © {year} {site.name} · Portrait by {site.photoCredit} · <a href="/llms.txt">llms.txt</a>
        </p>
      </div>
    </footer>
  );
}
