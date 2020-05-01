import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

function SEO({ description, lang, meta, title, slug, siteImage }){
    const { site } = useStaticQuery(
        graphql`
        query {
            site {
                siteMetadata {
                    description
                    author
                    siteUrl
                    siteImage
                }
            }
        }
        `
    );
    
    const metaDescription = description || site.siteMetadata.description;

    return (
        <Helmet
        htmlAttributes={{
            lang,
          }}
          title={title}
          meta={[
            {
               name: `description`,
               content: metaDescription,
             },
             {
               property: `og:title`,
               content: title,
             },
             {
               property: `og:description`,
               content: metaDescription,
             },
             {
               property: `og:image`,
               content: siteImage,
             },
             {
               property: `og:type`,
               content: `website`,
             },
             {
               name: `twitter:card`,
               content: `summary_large_image`,
             },
             {
               name: `twitter:creator`,
               content: `${site.siteMetadata.author}`,
             },
             {
                name: `twitter:image`,
                content: `${site.siteMetadata.siteImage}`,
            },
             {
               name: `twitter:title`,
               content: title,
             },
             {
               name: `twitter:description`,
               content: metaDescription,
             }
          ].concat(meta)}
        />
    )
}

SEO.defaultProps = {
    lang: `en`, //setting to english
    meta: [],
    description: ``,
    slug:'/'
}

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
    slug: PropTypes.string
}

export default SEO