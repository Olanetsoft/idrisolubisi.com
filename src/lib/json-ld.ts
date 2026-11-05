import { community } from "@/data/experience";
import { recognition } from "@/data/recognition";
import { site } from "@/data/site";

// Google's profile-page structured data: a ProfilePage whose main entity is the
// Person, plus the WebSite node. Stable @ids let crawlers merge the three.
const personId = `${site.url}/#person`;
export const jsonLd = {
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
      address: { "@type": "PostalAddress", addressLocality: site.location, addressCountry: "GB" },
      nationality: { "@type": "Country", name: "Nigeria" },
      knowsLanguage: ["en", "yo"],
      hasOccupation: {
        "@type": "Occupation",
        name: site.role,
        occupationLocation: { "@type": "City", name: site.location },
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
      award: recognition
        .filter((r) => r.kind === "endorsement" || r.kind === "award")
        .map((r) => `${r.by}: ${r.title}`),
      subjectOf: recognition
        .filter(
          (r) =>
            r.href &&
            (r.kind === "press" ||
              r.kind === "sponsored" ||
              r.kind === "interview" ||
              r.kind === "podcast"),
        )
        .map((r) =>
          r.kind === "interview"
            ? { "@type": "VideoObject", name: r.title, url: r.href, uploadDate: r.date }
            : r.kind === "podcast"
              ? {
                  "@type": "PodcastEpisode",
                  name: r.title,
                  url: r.href,
                  datePublished: r.date,
                  partOfSeries: { "@type": "PodcastSeries", name: r.by },
                }
              : {
                  "@type": r.kind === "sponsored" ? "AdvertiserContentArticle" : "NewsArticle",
                  headline: r.title,
                  url: r.href,
                  datePublished: r.date,
                  publisher: { "@type": "Organization", name: r.by },
                },
        ),
      knowsAbout: [
        "Developer Relations",
        "Developer education",
        "Developer Experience",
        "Model Context Protocol",
        "AI agents",
        "Zero-knowledge proofs",
        "Blockchain interoperability",
        "Technical writing",
      ],
      potentialAction: {
        "@type": "ScheduleAction",
        name: "Book a 30-minute call",
        target: site.bookingUrl,
      },
      sameAs: [
        site.links.github,
        site.links.linkedin,
        site.links.x,
        site.links.blog,
        site.links.youtubeChannel,
        site.links.freecodecamp,
        site.links.devto,
        site.links.logrocket,
        site.links.medium,
        site.links.sessionize,
        site.links.web3afrika,
        site.links.linktree,
      ],
    },
  ],
};
