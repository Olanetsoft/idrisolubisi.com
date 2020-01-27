module.exports = {
  siteMetadata: {
    title: 'Idris Olubisi Portfolio',
    author: 'Idris Olubisi',
    description: 'This is my blog where i write technical content and also a personal portfolio that tells a detailed information about me',
    social: {
      twitter: 'olanetsoft',
      github: 'olanetsoft'
    },
    siteUrl: `http://localhost:9000`
  },
  plugins: [
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/content/assets`,
    //     name: `assets`,
    //   }
    // },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/content/posts`,
    //     name: `blogPosts`,
    //   }
    // },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/unchecked-circle.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-transformer-remark`,
      options:{
        plugins: [
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
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-154454841-1`,
        head: true
      }
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: ``,
        includeInDevelopment: true
      }
    }
  ],
}
