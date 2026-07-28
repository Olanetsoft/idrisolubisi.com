/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 *
 * All <head> tags are produced through the Gatsby Head API (see
 * src/components/Seo.js and the `export const Head` in each page/template),
 * so no react-helmet SSR rewind is needed here.
 *
 * Site-wide third-party scripts live here instead, because the Head API is
 * per-page and analytics must load on every route.
 */

const React = require('react')

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="sabilytics"
      async
      src="https://www.sabilytics.com/script.js"
      data-site="z3p6fy6kw0ly"
      data-domain="idrisolubisi.com"
    />,
  ])
}
