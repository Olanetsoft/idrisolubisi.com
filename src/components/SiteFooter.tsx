import { site } from "@/data/site";

const links = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
  { label: "X", href: site.links.x },
  { label: "Blog", href: site.links.blog },
  { label: "YouTube", href: site.links.youtube },
  { label: "Sessionize", href: site.links.sessionize },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          © {year} {site.name}. Portrait by {site.photoCredit}. <a href="/llms.txt">llms.txt</a>
        </p>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} rel="me">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
