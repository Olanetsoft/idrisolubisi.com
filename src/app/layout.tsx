import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/data/site";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
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
  themeColor: "#ffffff",
};

const themeScript = `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.handle,
  url: site.url,
  image: `${site.url}/images/idris-portrait.jpg`,
  jobTitle: site.role,
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Abubakar Tafawa Balewa University",
  },
  founder: { "@type": "Organization", name: "Web3 Afrika", url: site.links.web3afrika },
  knowsAbout: [
    "Developer Relations",
    "Model Context Protocol",
    "AI agents",
    "Zero-knowledge proofs",
    "Blockchain interoperability",
    "Technical writing",
  ],
  sameAs: [
    site.links.github,
    site.links.linkedin,
    site.links.x,
    site.links.blog,
    site.links.freecodecamp,
    site.links.devto,
    site.links.sessionize,
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId={site.gaId} />}
      </body>
    </html>
  );
}
