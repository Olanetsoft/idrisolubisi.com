import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';

//Components
import SEO from '../components/seo'
import Footer from '../components/Footer'

//Style
import '../assets/css/posts.css'

class PostTemplate extends Component {
    render() {
        const frontmatter = this.props.data.markdownRemark.frontmatter;
        const { title, subtitle, description, date } = frontmatter;
        const post = this.props.data.markdownRemark;
        const { previous, next, slug } = this.props.pageContext;

        return (

            <div>
                <SEO title={title} description={description || post.excerpt} slug={slug} />
                <ul id="the-nav">
					<li><Link to="/blog" ><i className="fa fa-long-arrow-left"> Go Back To Articles Page</i></Link></li>
				</ul>
                <section className="posts">
                <p className="date">{date}</p>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
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
                <Footer/>
            </div>
        );
    }
}

export default PostTemplate;

export const pageQuery = graphql`
	query Posts($slug: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }) {
			id
			excerpt(pruneLength: 160)
			html
			frontmatter {
				title
				date(formatString: "MMMM DD, YYYY")
				subtitle
				description
			}
		}
	}
`;
