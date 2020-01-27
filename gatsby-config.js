module.exports = {
  siteMetadata: {
    title: 'Idris Olubisi Portfolio',
    author: 'Idris Olubisi',
    description: 'This is my personal portfolio that tells a detailed information about me',
    social: {
      twitter: 'olanetsoft',
      github: 'olanetsoft'
    }
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
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
  ],
}
