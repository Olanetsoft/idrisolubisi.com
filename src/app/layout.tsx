import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AgentTools } from "@/components/AgentTools";
import { Analytics } from "@/components/Analytics";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StructuredData } from "@/components/StructuredData";
import { site } from "@/data/site";
import { THEME_COLOR } from "@/lib/theme";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
});

// One weight keeps the font payload small; the mono labels are all small caps-size text.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s, ${site.name}`,
  },
  description: site.metaDescription,
  keywords: [
    "Idris Olubisi",
    "olanetsoft",
    "Senior Developer Relations Engineer",
    "Developer Advocate",
    "Developer Educator",
    "Forward Deployed Engineer",
    "Developer Success",
    "AI Engineer",
    "MCP server",
    "AI agents",
    "Developer experience",
    "Zero-knowledge proofs",
    "Midnight",
    "Axelar",
    "Web3 Afrika",
    "freeCodeCamp author",
    "Technical writer",
    "London",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.metaDescription,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    site: `@${site.handle}`,
    creator: `@${site.handle}`,
    title: site.title,
    description: site.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: THEME_COLOR.dark,
};

// Runs before paint: dark is the default, so this only applies a saved light
// choice, and puts back which playful pieces have been used, so their hints
// never flash on a return visit (src/lib/played.ts). Then it keeps the
// address-bar colour on the current theme: once the head is parsed, and again
// whenever navigation re-inserts the theme-color meta with its dark default.
const themeScript = `(function(){var d=document.documentElement;try{if(localStorage.getItem('theme')==='light')d.setAttribute('data-theme','light');var p=localStorage.getItem('played');if(p)d.setAttribute('data-played',p)}catch(e){}function s(){var c=d.getAttribute('data-theme')==='light'?'${THEME_COLOR.light}':'${THEME_COLOR.dark}';document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){if(m.content!==c)m.content=c})}document.addEventListener('DOMContentLoaded',function(){s();new MutationObserver(s).observe(document.head,{childList:true,subtree:true,attributes:true,attributeFilter:['content']})})})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="llms-full.txt" />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="https://blog.idrisolubisi.com/rss.xml"
          title="Idris Olubisi's blog"
        />
      </head>
      {/* Extensions such as Grammarly add attributes to <body> before React loads;
          this ignores those attribute differences on this one element only. */}
      <body id="top" suppressHydrationWarning>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <StructuredData />
        <AgentTools />
        {process.env.NODE_ENV === "production" && <Analytics gaId={site.gaId} />}
      </body>
    </html>
  );
}
