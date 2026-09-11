import { site } from "@/data/site";

const links = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
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
          Written in London. Started in Lagos. Read by ten million people and, since 2025, by
          their agents:{" "}
          <a href="/llms.txt" className="nav-mono" translate="no">
            /llms.txt
          </a>
          . Portrait by {site.photoCredit}. <a href={site.links.source}>Source on GitHub</a>. ©{" "}
          {year} {site.name}.
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
