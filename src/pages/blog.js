import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';
import Container from '../components/container'


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
                
                <h2>Articles</h2>
                <hr />
                {posts.map(({ node }) => {
                    const title = node.frontmatter.title || node.fields.slug;
                    return (
                        <div key={node.fields.slug}>
                            <h3 style={{ marginBottom: '.15rem', marginTop: '.90rem' }}>
                                <Link to={node.fields.slug}>{title}</Link>
                            </h3>
                            <small>{node.frontmatter.date}</small>
                            <div
										className="content"
										dangerouslySetInnerHTML={{ __html: shorten(node.html, 300) }}
									/>
									<Link to={node.fields.slug}>
										<button>Read more</button>
									</Link>
                            {/* <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                                 */}
                        </div>
                    );
                })}
                <Footer/>
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
					}
				}
			}
		}
	}
`;