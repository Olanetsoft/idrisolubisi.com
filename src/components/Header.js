import PropTypes from 'prop-types'
import React from 'react';
import Typed from 'react-typed';

const Header = props => (
  <header id="header" style={props.timeout ? { display: 'none' } : {}}>
    <div className="logo">
      <span className="icon fa-laptop"></span>
    </div>
    <div className="content">
      <div className="inner">
        <h1>
          <Typed
                strings={["i'm Idris olubisi"]}
                typeSpeed={30}
              />
        </h1>
         <h3 style={{color: "gold"}}>     
              <Typed
                strings={[
                    'I write code for a living',
                    'I write technical content',
                    'I love to write clean code',
                    'I love football'
                    ]}
                    typeSpeed={40}
                    backSpeed={60}
                    loop />
          </h3>
        <p>
        I’m a Software Engineer based in Lagos, Nigeria. <br/>
        I'm passionate about writing code that solves problem.
          {/* A fully responsive site template designed by{' '}
          <a href="https://html5up.net">HTML5 UP</a> and released
          <br />
          for free under the{' '}
          <a href="https://html5up.net/license">Creative Commons</a> license. */}
        </p>
      </div>
    </div>
    <nav>
      <ul>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('intro')
            }}
          >
            My Blog <span className="fa fa-pencil" aria-hidden="true"></span>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('work')
            }}
          >
            PROJECTS <span className="icon fa-laptop"></span>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('about')
            }}
          >
            About Me <span className="icon fa-user"></span>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('contact')
            }}
          >
            Contact <span className="icon fa-address-card"></span>
          </button>
        </li>
      </ul>
    </nav>
  </header>
)

Header.propTypes = {
  onOpenArticle: PropTypes.func,
  timeout: PropTypes.bool,
}

export default Header
