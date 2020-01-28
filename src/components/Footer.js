import React from 'react'
import PropTypes from 'prop-types'

let date = new Date();
let newDate = date.getFullYear();
const Footer = (props) => (
    <footer id="footer" style={props.timeout ? {display: 'none'} : {}}>
         <ul className="icons">
            <li>
              <a
                href="https://twitter.com/olanetsoft"
                className="icon fa-twitter"
                target='_blank'
              >
                <span className="label">Twitter</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/olanetsoft"
                className="icon fa-github"
                target='_blank'
              >
                <span className="label">GitHub</span>
              </a>
            </li>
            <li>
              <a href="https://medium.com/@olanetsoft"
               className="icon fa-medium"
               target='_blank'>
                <span className="label">Medium</span>
              </a>
            </li>
            <li>
              <a href="https://facebook.com/olubisiidris"
               className="icon fa-facebook"
               target='_blank'>
                <span className="label">Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/olanetsoft"
               className="icon fa-instagram"
               target='_blank'>
                <span className="label">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/olubisi-idris-ayinde-05727b17a/"
                className="icon fa-linkedin"
                target='_blank'
              >
                <span className="label">linkedIn</span>
              </a>
            </li>
            
          </ul>
        <p className="copyright">&copy;{newDate} Made with <a href="https://www.twitter.com/olanetsoft" className="icon fa-heart"> by @olanetsoft  Powered by</a><a href="https://www.gatsbyjs.org/" > Gatsby</a></p>
    </footer>
)

Footer.propTypes = {
    timeout: PropTypes.bool
}

export default Footer
