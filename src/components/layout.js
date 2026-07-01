import React from 'react'
import PropTypes from 'prop-types'

import '../assets/scss/main.scss'

// All <head> tags (title, meta, canonical, Open Graph, JSON-LD) are handled by
// the Seo component via the Gatsby Head API. Layout only wraps page content.
const Layout = ({ children, location }) => {
  if (location && location.pathname === '/') {
    return <div>{children}</div>
  }

  return (
    <div id="wrapper" className="page">
      <div>{children}</div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
