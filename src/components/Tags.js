import React from 'react';
import Link from 'gatsby-link';
//import { TagIcon } from 'react-icons/lib/cjs';

import '../assets/css/tags.css';

const Tags = ({ list = [] })=> {
    return (
        <ul className="tags">
            {list.map(tag =>
                <li key={tag}>
                    <Link to={`/tags/${tag}`} className="tag" style={{color: 'white'}}>
                    <i class="fa fa-tag fa_custom"></i>
                        {/* <TagIcon size={15} className="icon white" /> */}
                         {tag}
                    </Link>
                </li>
            )}
        </ul>
    );
}

export default Tags;