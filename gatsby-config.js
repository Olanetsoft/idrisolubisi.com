module.exports = {
  siteMetadata: {
    title: 'Idris Olubisi | Software Engineer & Developer Advocate',
    author: 'Idris Olubisi',
    description:
      'Idris is a Software Engineer, Developer Advocate, Technical Writer, Speaker and Open-source contributor.',
    social: {
      twitter: '@olanetsoft',
      github: 'olanetsoft',
      linkedin: 'idris-olubisi',
    },
    siteUrl: `https://idrisolubisi.com`,
    siteImage: `https://idrisolubisi.com/dp.png`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-preconnect',
      options: {
        domains: [
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/Content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/Content/posts`,
        name: `blogPosts`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Idris Olubisi | Software Engineer & Developer Advocate',
        short_name: 'Idris Olubisi',
        description:
          'Idris Olubisi - Software Engineer & Developer Educator at Midnight Foundation, Founder of Web3 Afrika, Technical Writer with 1M+ views',
        start_url: '/',
        background_color: '#1d1f21',
        theme_color: '#663399',
        display: 'standalone',
        icon: 'src/images/dp.png',
        crossOrigin: 'use-credentials',
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              quality: 90,
              withWebp: true,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-copy-linked-files`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: () => 'https://idrisolubisi.com',
        serialize: ({ path }) => ({
          url: path,
          changefreq: path === '/' ? 'weekly' : 'monthly',
          priority: path === '/' ? 1.0 : 0.7,
        }),
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['G-7MMFT1BXJV'],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: true,
          respectDNT: true,
        },
      },
    },
  ],
}
