import React from 'react'
import { graphql, Link } from 'gatsby'
import { DiscussionEmbed } from 'disqus-react'
import { getSrc } from 'gatsby-plugin-image'

//Components
import Seo from '../components/Seo'
import Footer from '../components/Footer'

//Style
import '../assets/css/posts.css'

const PostTemplate = ({ data, pageContext }) => {
  const frontmatter = data.markdownRemark.frontmatter
  const { title, date } = frontmatter
  const post = data.markdownRemark
  const { previous, next, slug } = pageContext
  const disqusConfig = {
    shortname: 'idrisolubisi.com',
    config: { identifier: slug, title },
  }
  return (
    <div>
      <ul id="the-nav">
        <li>
          <Link to="/blog">
            <i className="fa fa-long-arrow-left"> Go Back To Articles Page</i>
          </Link>
        </li>
      </ul>
      <section className="posts">
        <h2 id="post-Title">{title}</h2>
        <p className="date">{date}</p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <DiscussionEmbed {...disqusConfig} />
        <ul>
          <li className="post-navigation">
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li className="post-navigation">
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </section>
      <Footer />
    </div>
  )
}

export default PostTemplate

export const Head = ({ data, pageContext }) => {
  const { title, description } = data.markdownRemark.frontmatter
  const post = data.markdownRemark
  const { slug } = pageContext
  const image = post.frontmatter.image
    ? {
        src: getSrc(post.frontmatter.image),
        width: post.frontmatter.image.childImageSharp.gatsbyImageData.width,
        height: post.frontmatter.image.childImageSharp.gatsbyImageData.height,
      }
    : null
  return (
    <Seo
      title={title}
      description={description || post.excerpt}
      slug={slug}
      image={image}
      article={true}
      datePublished={post.frontmatter.rawDate}
    />
  )
}

export const pageQuery = graphql`
  query Posts($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        rawDate: date(formatString: "YYYY-MM-DD")
        subtitle
        description
        image {
          childImageSharp {
            gatsbyImageData(width: 1200, layout: CONSTRAINED)
          }
        }
      }
    }
  }
`
