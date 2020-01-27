import React, { Component } from 'react';

//Components
import SEO from '../components/seo'


class PostTemplate extends Component {
    render() {
        return (
            <div>
                <SEO title="another title" description="Another description" />
            </div>
        );
    }
}

export default PostTemplate;