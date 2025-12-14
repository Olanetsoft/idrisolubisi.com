import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

function Seo({
  description,
  lang,
  meta,
  title,
  slug,
  image: metaImage,
  article,
  datePublished,
  dateModified,
}) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
          siteImage
          social {
            twitter
            github
            linkedin
          }
        }
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description
  const siteUrl = site.siteMetadata.siteUrl
  const image =
    metaImage && metaImage.src
      ? `${siteUrl}${metaImage.src}`
      : site.siteMetadata.siteImage

  const canonical = slug ? `${siteUrl}${slug}` : siteUrl

  // Comprehensive Person Schema for Google Knowledge Panel & LLM crawlers
  // Fact-checked from public profiles: GitHub, LinkedIn, Sessionize, Hashnode
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}#idris-olubisi`,
    name: 'Idris Olubisi',
    givenName: 'Idris',
    familyName: 'Olubisi',
    alternateName: ['olanetsoft', 'Olanetsoft'],
    url: siteUrl,
    image: site.siteMetadata.siteImage,
    jobTitle: 'Developer Educator - DevRel',
    description: site.siteMetadata.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'United Kingdom',
    },
    nationality: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    knowsAbout: [
      'Blockchain Development',
      'Zero-Knowledge Proofs',
      'Web3',
      'Cross-chain Technology',
      'Solidity',
      'Smart Contracts',
      'Privacy Technology',
      'Midnight Network',
      'Developer Relations',
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
        name: 'Developer DAO',
        description: 'Web3 developer community',
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
      '8.8K+ Blog Followers on Hashnode',
      '1.3K+ GitHub Followers',
    ],
  }

  // ProfilePage Schema for better personal website SEO
  const profilePageSchema = {
    '@context': 'https://schema.org',
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
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: site.siteMetadata.title,
    url: siteUrl,
    description: site.siteMetadata.description,
    inLanguage: 'en-US',
    author: {
      '@id': `${siteUrl}#idris-olubisi`,
    },
    publisher: {
      '@id': `${siteUrl}#idris-olubisi`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}blog/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  // BreadcrumbList for better navigation SEO
  const breadcrumbSchema = article
    ? {
        '@context': 'https://schema.org',
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
        '@context': 'https://schema.org',
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

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={slug === '/' ? title : `%s | Idris Olubisi`}
      link={[
        {
          rel: 'canonical',
          href: canonical,
        },
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        // LLM & AI crawler support
        {
          rel: 'author',
          href: `${siteUrl}/about`,
        },
        {
          rel: 'me',
          href: 'https://github.com/olanetsoft',
        },
        {
          rel: 'me',
          href: 'https://twitter.com/olanetsoft',
        },
      ]}
      meta={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: metaDescription,
        },
        {
          name: 'keywords',
          content:
            'Idris Olubisi, olanetsoft, Software Engineer, Developer Educator, Midnight Foundation, Web3 Afrika, Technical Writer, Blockchain Developer, Web3, Solidity, React, Next.js, Node.js, Open Source, Developer Advocate, freeCodeCamp author',
        },
        {
          name: 'author',
          content: 'Idris Olubisi',
        },
        {
          name: 'robots',
          content:
            'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        {
          name: 'googlebot',
          content: 'index, follow',
        },
        // AI/LLM friendly meta tags
        {
          name: 'ai-content-declaration',
          content: 'human-authored',
        },
        {
          name: 'generator',
          content: 'Gatsby 5',
        },
        // Open Graph
        {
          property: 'og:site_name',
          content: 'Idris Olubisi',
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:image',
          content: image,
        },
        {
          property: 'og:image:alt',
          content: title,
        },
        {
          property: 'og:image:width',
          content: '1200',
        },
        {
          property: 'og:image:height',
          content: '630',
        },
        {
          property: 'og:url',
          content: canonical,
        },
        {
          property: 'og:type',
          content: article ? 'article' : 'website',
        },
        {
          property: 'og:locale',
          content: 'en_US',
        },
        // Article specific OG tags
        ...(article
          ? [
              { property: 'article:author', content: 'Idris Olubisi' },
              { property: 'article:published_time', content: datePublished },
              {
                property: 'article:modified_time',
                content: dateModified || datePublished,
              },
            ]
          : []),
        // Twitter Card
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@olanetsoft',
        },
        {
          name: 'twitter:creator',
          content: '@olanetsoft',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
        {
          name: 'twitter:image',
          content: image,
        },
        {
          name: 'twitter:image:alt',
          content: title,
        },
        // Additional SEO
        {
          name: 'monetization',
          content: '$ilp.uphold.com/eNN6da7eFU9N',
        },
        {
          name: 'theme-color',
          content: '#663399',
        },
        // Verification (add your actual codes when available)
        // { name: 'google-site-verification', content: 'your-code' },
      ].concat(meta)}
    >
      {/* JSON-LD Structured Data for SEO & LLM Crawlers */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">
        {JSON.stringify(profilePageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  )
}

Seo.defaultProps = {
  lang: 'en',
  meta: [],
  description: '',
  slug: '/',
  article: false,
  datePublished: null,
  dateModified: null,
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
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
