import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import Container from '../components/container'


//style
import '../assets/css/blog.css'

// Utils
import { shorten } from '../utils/truncateStr';
import Footer from '../components/Footer'
import SEO from '../components/seo'


class Blog extends Component {
	render() {
		const { data } = this.props;
		const posts = data.allMarkdownRemark.edges;
		return (

			<Container>
				<SEO title="Blog - All Post" />
				<ul id="link-back-home">
					<li><Link to="/" ><i className="fa fa-long-arrow-left"> Go Back Home</i></Link></li>
				</ul>
				<h2>Articles</h2>
				<hr />
				{posts.map(({ node }) => {
					const title = node.frontmatter.title || node.fields.slug;
					return (
						<Link to={node.fields.slug}>
							<div key={node.fields.slug} className="card">
								<Img className="post-img" sizes={node.frontmatter.image.childImageSharp.sizes} />
								<h3 style={{ marginBottom: '.15rem', marginTop: '.90rem' }}>
									<Link to={node.fields.slug}>{title}</Link>
								</h3>
								<small>{node.frontmatter.date}</small>
								<div
									className="container"
									dangerouslySetInnerHTML={{ __html: shorten(node.html, 150) }}
								/>

								{/* <div className="button-link">
								<Link to={node.fields.slug}>
									<button>Read more</button>
								</Link>
							</div> */}

								{/* <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                                 */}
							</div>
						</Link>
					);
				})}
				<Footer />
			</Container>


		);
	}
}

export default Blog;

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
				author
				
			}
		}
		allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
							  sizes(maxWidth:600 , maxHeight: 300, quality: 90) {
								...GatsbyImageSharpSizes
							  }
							}
						}
					}
				}
			}
		}
	}
`;