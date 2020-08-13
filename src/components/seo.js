import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

function SEO({ description, lang, meta, title, slug, image: metaImage }) {
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
  const image =
    metaImage && metaImage.src
      ? `${site.siteMetadata.siteUrl}${metaImage.src}`
      : `${site.siteMetadata.siteImage}`

  const canonical = slug ? `${site.siteMetadata.siteUrl}${slug}` : null
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      link={
        canonical
          ? [
            {
              rel: "canonical",
              href: canonical,
            },
          ]
          : []
      }
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
        // {
        //   property: "og:image",
        //   content: `${site.siteMetadata.siteImage}`,
        // },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:creator`,
          content: `${site.siteMetadata.author}`,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(
        metaImage
          ? [
            {
              property: "og:image",
              content: image,
            },
            {
              property: `og:description`,
              content: metaDescription,
            },
            {
              property: "og:image:width",
              content: metaImage.width,
            },
            {
              property: "og:image:height",
              content: metaImage.height,
            },
            {
              name: "twitter:card",
              content: "summary_large_image",
            },
          ]
          : [
            {
              name: "twitter:card",
              content: "summary",
            },
          ]
      ).concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`, //setting to english
  meta: [],
  description: ``,
  slug: '/'
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  slug: PropTypes.string,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  })
}

export default SEO