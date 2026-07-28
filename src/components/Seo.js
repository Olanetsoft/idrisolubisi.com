import React from 'react'
import PropTypes from 'prop-types'

// Site metadata is inlined here because the Gatsby Head API does NOT support
// useStaticQuery. Keep in sync with gatsby-config.js siteMetadata.
const siteMetadata = {
  title: 'Idris Olubisi | Software Engineer & Developer Advocate',
  description:
    'Idris Olubisi (olanetsoft) is a Senior Developer Relations Engineer at Midnight, founder of Web3 Afrika, and freeCodeCamp author with 1M+ views — empowering developers across Africa and beyond.',
  author: 'Idris Olubisi',
  siteUrl: 'https://idrisolubisi.com',
  siteImage: 'https://idrisolubisi.com/dp.png',
}

// Serialize JSON-LD for inline injection. Escapes characters that could break out
// of the <script> block (`<`, `>`, `&`) plus the JS-invalid line separators.
const serializeJsonLd = data =>
  JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

function Seo({
  description = '',
  lang = 'en',
  title,
  slug = '/',
  image: metaImage,
  article = false,
  datePublished = null,
  dateModified = null,
}) {
  const metaDescription = description || siteMetadata.description
  const siteUrl = siteMetadata.siteUrl
  const image =
    metaImage && metaImage.src
      ? `${siteUrl}${metaImage.src}`
      : siteMetadata.siteImage

  const canonical = slug ? `${siteUrl}${slug}` : siteUrl
  const isHome = slug === '/'
  const fullTitle = isHome ? title : `${title} | Idris Olubisi`

  // Comprehensive Person Schema for Google Knowledge Panel & LLM crawlers
  // Fact-checked from public profiles: GitHub, LinkedIn, Sessionize, Hashnode
  const personSchema = {
    '@type': 'Person',
    '@id': `${siteUrl}#idris-olubisi`,
    name: 'Idris Olubisi',
    givenName: 'Idris',
    familyName: 'Olubisi',
    alternateName: ['olanetsoft', 'Olanetsoft'],
    url: siteUrl,
    image: siteMetadata.siteImage,
    jobTitle: 'Senior Developer Relations Engineer',
    description: siteMetadata.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'United Kingdom',
    },
    nationality: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Abubakar Tafawa Balewa University',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bauchi',
        addressCountry: 'Nigeria',
      },
    },
    knowsAbout: [
      'Blockchain Development',
      'Zero-Knowledge Proofs',
      'Web3',
      'Cross-chain Technology',
      'Solidity',
      'Smart Contracts',
      'Privacy Technology',
      'Privacy-Preserving Smart Contracts',
      'Midnight Network',
      'Model Context Protocol (MCP)',
      'AI Agents',
      'AI-Assisted Developer Tooling',
      'Developer Experience',
      'Developer Relations',
      'Rust',
      'Python',
      'Payments Infrastructure',
      'Stablecoins',
      'Technical Writing',
      'React',
      'Next.js',
      'Node.js',
      'JavaScript',
      'TypeScript',
      'Serverless Architecture',
      'Open Source',
      'Developer Advocacy',
      'Community Building',
      'Public Speaking',
      'Hackathons',
      'Web Development',
      'Full-Stack Development',
      'APIs',
      'GraphQL',
      'Gatsby',
      'Jamstack',
      'Software Engineering Best Practices',
      'Clean Code Principles',
      'Agile Methodologies',
      'Content Creation',
      'Tutorials and Workshops',
      'Tech Blogging',
      'Technical Documentation',
      'Open Source Contribution',
      'Mentorship and Coaching',
      'Diversity and Inclusion in Tech',
      'Web3 Education',
      'Decentralized Applications (dApps)',
      'Cryptography',
      'Privacy-Preserving Technologies',
      'Cross-Chain Interoperability',
      'Blockchain Scalability Solutions',
      'Decentralized Finance (DeFi)',
    ],
    knowsLanguage: ['English', 'Yoruba'],
    sameAs: [
      'https://twitter.com/olanetsoft',
      'https://github.com/olanetsoft',
      'https://www.linkedin.com/in/idris-olubisi/',
      'https://blog.idrisolubisi.com',
      'https://hashnode.com/@olanetsoft',
      'https://www.freecodecamp.org/news/author/idris/',
      'https://dev.to/olanetsoft',
      'https://medium.com/@olanetsoft',
      'https://sessionize.com/olanetsoft',
      'https://www.youtube.com/@olanetsoft',
    ],
    worksFor: [
      {
        '@type': 'Organization',
        name: 'Midnight Foundation',
        url: 'https://midnight.network',
        description:
          'Data protection blockchain enabling confidential smart contracts',
      },
      {
        '@type': 'Organization',
        name: 'Web3 Afrika',
        url: 'https://web3afrika.com',
        description:
          'Community of 15,000+ Web3 builders across Africa, backed by Developer DAO',
      },
      {
        '@type': 'Organization',
        name: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org',
        description:
          'Non-profit organization making web development accessible to anyone',
      },
    ],
    memberOf: [
      {
        '@type': 'Organization',
        name: 'Developer DAO',
        description: 'Web3 developer community',
      },
      {
        '@type': 'Organization',
        name: 'SheCodeAfrica',
        description:
          'Non-profit community of 50,000+ women in tech across 15 African countries; Idris led the backend community',
      },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Arctic Code Vault Contributor',
        credentialCategory: 'GitHub Achievement',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Starstruck x3',
        credentialCategory: 'GitHub Achievement',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Pull Shark x4',
        credentialCategory: 'GitHub Achievement',
      },
    ],
    // Publications & Writing
    publishingPrinciples: 'https://blog.idrisolubisi.com',
    award: [
      'Over 1 Million Article Views',
      'Midnight MCP server: 10,000+ downloads, 11,900+ AI-agent tool calls',
      'Midnight Academy: 1,120+ certified developers',
      '8.8K+ Blog Followers on Hashnode',
      '1.3K+ GitHub Followers',
    ],
    // Press & media coverage about Idris (third-party authority signals)
    subjectOf: [
      {
        '@type': 'NewsArticle',
        headline:
          'Meet Idris Olubisi, the Nigerian Web3 pioneer building Africa’s next generation of tech',
        url: 'https://africa.businessinsider.com/local/lifestyle/meet-idris-olubisi-the-nigerian-web3-pioneer-building-africas-next-generation-of-tech/w89mmn5',
        publisher: { '@type': 'Organization', name: 'Business Insider Africa' },
      },
      {
        '@type': 'NewsArticle',
        headline:
          'Idris Olubisi is championing Web3 inclusion in Africa beyond limits',
        url: 'https://technext24.com/2025/11/27/idris-olubisi-championing-web3-africa/',
        datePublished: '2025-11-27',
        publisher: { '@type': 'Organization', name: 'Technext' },
      },
      {
        '@type': 'NewsArticle',
        headline:
          'The Builder Who Teaches: Inside the mind of the engineer shaping Africa’s Web3 future',
        url: 'https://businessday.ng/bd-weekender/article/the-builder-who-teaches-inside-the-mind-of-the-engineer-shaping-africas-web3-future/',
        publisher: { '@type': 'Organization', name: 'BusinessDay' },
      },
      {
        '@type': 'NewsArticle',
        headline:
          'The Build Afrika Summit Rallies Africa’s Top Tech Talent to Build the Future of Decentralization',
        url: 'https://techpoint.africa/brandpress/the-build-afrika-summit-rallies-africas-top-tech-talent-to-build-the-future-of-decentralization/',
        datePublished: '2025-05-15',
        publisher: { '@type': 'Organization', name: 'Techpoint Africa' },
      },
      {
        '@type': 'NewsArticle',
        headline:
          'BlockFest Africa 2025 draws 12,000 participants, strengthens Africa’s Web3 voice',
        url: 'https://businessday.ng/news/article/blockfest-africa-2025-draws-12000-participants-strengthens-africas-web3-voice/',
        publisher: { '@type': 'Organization', name: 'BusinessDay' },
      },
      {
        '@type': 'NewsArticle',
        headline:
          'Investing in Africa’s Web3 Renaissance: The Strategic Case for Supporting Idris Olubisi’s Web3 Afrika Ecosystem',
        url: 'https://www.ainvest.com/news/investing-africa-web3-renaissance-strategic-case-supporting-idris-olubisi-web3-afrika-ecosystem-2511/',
        publisher: { '@type': 'Organization', name: 'AInvest' },
      },
    ],
  }

  // ProfilePage Schema for better personal website SEO
  const profilePageSchema = {
    '@type': 'ProfilePage',
    '@id': `${siteUrl}#profilepage`,
    name: 'Idris Olubisi - Portfolio',
    url: siteUrl,
    description: metaDescription,
    mainEntity: {
      '@id': `${siteUrl}#idris-olubisi`,
    },
  }

  // Website Schema
  const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: siteMetadata.title,
    url: siteUrl,
    description: siteMetadata.description,
    inLanguage: 'en-US',
    author: {
      '@id': `${siteUrl}#idris-olubisi`,
    },
    publisher: {
      '@id': `${siteUrl}#idris-olubisi`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  // BreadcrumbList for better navigation SEO (blog posts only)
  const breadcrumbSchema = article
    ? {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${siteUrl}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: canonical,
          },
        ],
      }
    : null

  // Article Schema (for blog posts)
  const articleSchema = article
    ? {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: title,
        description: metaDescription,
        image: image,
        inLanguage: 'en-US',
        author: {
          '@id': `${siteUrl}#idris-olubisi`,
        },
        publisher: {
          '@id': `${siteUrl}#idris-olubisi`,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical,
        },
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        isAccessibleForFree: true,
      }
    : null

  // Combine every entity into a single @graph. Emitting one JSON-LD block (rather
  // than several identical <script> tags) avoids Gatsby Head de-duplication and is
  // the recommended way to express multiple schema.org entities on one page.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema,
      profilePageSchema,
      websiteSchema,
      ...(articleSchema ? [articleSchema] : []),
      ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ],
  }

  const keywords =
    'Idris Olubisi, olanetsoft, Senior Developer Relations Engineer, DevRel, Developer Advocate, AI Engineer, Midnight, Web3 Afrika, MCP, AI Agents, Developer Experience, Zero-Knowledge Proofs, Technical Writer, Blockchain Developer, Web3, Africa, Solidity, React, Next.js, Node.js, Open Source, freeCodeCamp author'

  return (
    <>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonical} />
      <link rel="icon" href="/favicon.ico" />
      {/* LLM & AI crawler support */}
      <link rel="author" href={siteUrl} />
      <link rel="me" href="https://github.com/olanetsoft" />
      <link rel="me" href="https://twitter.com/olanetsoft" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Idris Olubisi" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />
      {/* AI/LLM friendly meta tags */}
      <meta name="ai-content-declaration" content="human-authored" />
      <meta name="generator" content="Gatsby 5" />

      {/* Open Graph */}
      <meta property="og:site_name" content="Idris Olubisi" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:locale" content="en_US" />
      {article && <meta property="article:author" content="Idris Olubisi" />}
      {article && datePublished && (
        <meta property="article:published_time" content={datePublished} />
      )}
      {article && (
        <meta
          property="article:modified_time"
          content={dateModified || datePublished}
        />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@olanetsoft" />
      <meta name="twitter:creator" content="@olanetsoft" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional */}
      <meta name="theme-color" content="#663399" />
      <meta name="monetization" content="$ilp.uphold.com/eNN6da7eFU9N" />

      {/* JSON-LD Structured Data for SEO & LLM crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
    </>
  )
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  article: PropTypes.bool,
  datePublished: PropTypes.string,
  dateModified: PropTypes.string,
}

export default Seo
