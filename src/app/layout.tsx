import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";
import { community } from "@/data/experience";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";
import { THEME_COLOR } from "@/lib/theme";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
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
    description: site.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    site: `@${site.handle}`,
    creator: `@${site.handle}`,
    title: site.title,
    description: site.description,
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
  themeColor: THEME_COLOR.light,
};

// Runs before paint: applies a saved dark choice, then matches the address bar
// to the black page once the head has been parsed.
const themeScript = `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark');document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content='${THEME_COLOR.dark}'})})}}catch(e){}})();`;

// Google's profile-page structured data: a ProfilePage whose main entity is the
// Person, plus the WebSite node. Stable @ids let crawlers merge the three.
const personId = `${site.url}/#person`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: "en-GB",
      dateModified: new Date().toISOString().slice(0, 10),
      mainEntity: { "@id": personId },
      isPartOf: { "@id": `${site.url}/#website` },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "en-GB",
      publisher: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      givenName: "Idris",
      familyName: "Olubisi",
      alternateName: site.handle,
      url: site.url,
      image: `${site.url}/images/idris-portrait.jpg`,
      jobTitle: site.role,
      email: site.email,
      description: site.description,
      address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
      nationality: { "@type": "Country", name: "Nigeria" },
      knowsLanguage: ["en", "yo"],
      hasOccupation: {
        "@type": "Occupation",
        name: "Developer Relations Engineer",
        occupationLocation: { "@type": "City", name: "London" },
        skills: [
          ...site.disciplines,
          "Technical writing",
          "Public speaking",
          "Community building",
        ].join(", "),
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Abubakar Tafawa Balewa University",
      },
      founder: { "@type": "Organization", name: "Web3 Afrika", url: site.links.web3afrika },
      memberOf: community
        .filter((c) => c.role !== "Founder")
        .map((c) => ({ "@type": "Organization", name: c.org, url: c.href })),
      award: recognition.filter((r) => r.kind === "endorsement").map((r) => r.title),
      subjectOf: recognition
        .filter((r) => r.href && (r.kind === "press" || r.kind === "sponsored"))
        .map((r) => ({
          "@type": r.kind === "sponsored" ? "AdvertiserContentArticle" : "NewsArticle",
          headline: r.title,
          url: r.href,
          datePublished: r.date,
          publisher: { "@type": "Organization", name: r.by },
        })),
      knowsAbout: [
        "Developer Relations",
        "Developer Experience",
        "Model Context Protocol",
        "AI agents",
        "Zero-knowledge proofs",
        "Blockchain interoperability",
        "Technical writing",
      ],
      potentialAction: {
        "@type": "ScheduleAction",
        name: "Book a 15-minute call",
        target: site.bookingUrl,
      },
      sameAs: [
        site.links.github,
        site.links.linkedin,
        site.links.x,
        site.links.blog,
        site.links.youtube,
        site.links.freecodecamp,
        site.links.devto,
        site.links.sessionize,
        site.links.web3afrika,
        site.links.linktree,
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        {process.env.NODE_ENV === "production" && (
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        )}
      </head>
      <body>
        <div className="theme-corner">
          <ThemeToggle />
        </div>
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId={site.gaId} />}
      </body>
    </html>
  );
}
