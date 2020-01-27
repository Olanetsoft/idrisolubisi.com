import React, { Component } from 'react';
import Layout from '../components/layout'
import { graphql } from 'gatsby'

import SEO from '../components/seo'

class Blog extends Component {
    render() {
        const { data } = this.props
        return (
            <Layout location={this.props.location}>
                <SEO title="Blog - All Post" />
                <div>
                    <p>All post page</p>
                </div>

            </Layout>
        );
    }
}

export default Blog;

export const pageQuery = graphql`
query{
    site{
        siteMetadata{
            title
            author
        }
    }
}
`