module.exports = {
  siteMetadata: {
    title: 'Idris Olubisi Portfolio',
    author: 'Idris Olubisi',
    description: 'This is my personal portfolio that tells a detailed information about me',
    social: {
      twitter: 'olanetsoft',
      github: 'olanetsoft'
    },
    siteUrl: `http://localhost:9000`
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts`,
        name: `blogPosts`,
      }
    },
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

      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: ``,
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
