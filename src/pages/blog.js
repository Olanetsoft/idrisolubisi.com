import React from 'react'
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Container from '../components/container'

//style
import '../assets/css/blog.css'

// Utils
import { shorten } from '../utils/truncateStr'
import Footer from '../components/Footer'
import Seo from '../components/Seo'

const Blog = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  return (
    <Container>
      <Seo title="Idris Olubisi's Blog - All Post" />
      <ul id="link-back-home">
        <li>
          <Link to="/">
            <i className="fa fa-long-arrow-left"> Go Back Home</i>
          </Link>
        </li>
      </ul>
      <h2>Articles</h2>
      <hr />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        const image = getImage(node.frontmatter.image)
        return (
          <Link to={node.fields.slug} key={node.fields.slug}>
            <div className="card">
              {image && (
                <GatsbyImage className="post-img" image={image} alt={title} />
              )}
              <div className="mainc">
                <h3>
                  <Link to={node.fields.slug}>{title}</Link>
                </h3>
                <small>{node.frontmatter.date}</small>
                <div
                  className="container"
                  dangerouslySetInnerHTML={{ __html: shorten(node.html, 80) }}
                />
              </div>
            </div>
          </Link>
        )
      })}
      <Footer />
    </Container>
  )
}

export default Blog

export const Head = ({ data }) => (
  <Seo title="Idris Olubisi's Blog - All Post" />
)

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          html
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            image {
              childImageSharp {
                gatsbyImageData(
                  width: 600
                  height: 300
                  quality: 90
                  layout: CONSTRAINED
                )
              }
            }
          }
        }
      }
    }
  }
`
