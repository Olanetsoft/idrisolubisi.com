module.exports = {
  siteMetadata: {
    title: 'Idris Olubisi Portfolio',
    author: 'Idris Olubisi',
    description: 'Idris is a Software Engineer based in Lagos, Nigeria.He is passionate about writing code that solves problem.',
    social: {
      twitter: '@olanetsoft',
      github: 'olanetsoft'
    },
    siteUrl: `https://idrisolubisi.com/`,
    siteImage: `https://res.cloudinary.com/olanetsoft/image/upload/v1588335882/Idris%20Portfolio%20Pictures/thenew2.jpg`
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/Content/assets`,
        name: `assets`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/Content/posts`,
        name: `blogPosts`,
      }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Idris Olubisi Portfolio',
        short_name: 'Idris Portfolio',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/unchecked-circle.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-offline',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-lazy-load`,
          {
            resolve: `gatsby-remark-social-cards`,
            options: {
              title: {
                field: "title",
                font: "DejaVuSansCondensed",
                color: "black", // black|white
                size: 48, // 16|24|32|48|64
                style: "bold", // normal|bold|italic
                x: null, // Will default to xMargin
                y: null, // Will default to yMargin
              },
              meta: {
                parts: [
                  "- ",
                  { field: "author" },
                  " » ",
                  { field: "date", format: "mmmm dS" },
                ],
                font: "DejaVuSansCondensed",
                color: "black", // black|white
                size: 24, // 16|24|32|48|64
                style: "normal", // normal|bold|italic
                x: null, // Will default to xMargin
                y: null, // Will default to cardHeight - yMargin - size
              },
              background: "#FFFFFF", // Background color for the card
              xMargin: 24, // Edge margin used when x value is not set
              yMargin: 24,// Edge margin used when y value is not set
            }
          }
        ]
      }
    },
    `gatsby-plugin-preact`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-154454841-1`,
        head: true,
      }
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: `GTM-T99QM6R`,
        includeInDevelopment: true
      },
    }
  ],
}