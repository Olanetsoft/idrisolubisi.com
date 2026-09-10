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
        <p className="colophon">
          © {year} {site.name}. Set in Fraunces, Instrument Sans and JetBrains Mono. Built with
          Next.js and hosted on Netlify;{" "}
          <a href="https://github.com/Olanetsoft/idrisolubisi.com" rel="noopener">
            source on GitHub
          </a>
          . Structured information for language models at{" "}
          <a href="/llms.txt">/llms.txt</a>.
        </p>
        <ul className="mono">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} rel="me noopener">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
