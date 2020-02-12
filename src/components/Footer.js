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
                rel="noopener noreferrer"
                aria-label="Twitter"
              > </a>
            </li>
            <li>
              <a
                href="https://github.com/olanetsoft"
                className="icon fa-github"
                target='_blank'
                rel="noopener noreferrer"
                aria-label="Github"
              ></a>
            </li>
            <li>
              <a href="https://medium.com/@olanetsoft"
                className="icon fa-medium"
                target='_blank'
                rel="noopener noreferrer"
                aria-label="Medium">
              </a>
            </li>
            <li>
              <a href="https://facebook.com/olubisiidris"
                className="icon fa-facebook"
                target='_blank'
                rel="noopener noreferrer"
                aria-label="Facebook">
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/olanetsoft"
                className="icon fa-instagram"
                target='_blank'
                rel="noopener noreferrer"
                aria-label="Instagram">
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/olubisi-idris-ayinde-05727b17a/"
                className="icon fa-linkedin"
                target='_blank'
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
              </a>
            </li>

          </ul>
        <h1 className="copyright">&copy;{newDate} Made with <a href="https://www.twitter.com/olanetsoft" target='_blank' rel="noopener noreferrer"><i className="icon fa-heart" style={{color:"red"}}></i> by @olanetsoft  Powered by</a><a href="https://www.gatsbyjs.org/" target="_blank" rel="noopener noreferrer"> Gatsby</a></h1>
    </footer>
)

Footer.propTypes = {
    timeout: PropTypes.bool
}

export default Footer
