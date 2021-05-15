import PropTypes from 'prop-types'
import React from 'react'
import Typed from 'react-typed'

const Header = props => (
  <header id="header" style={props.timeout ? { display: 'none' } : {}}>
    <div className="logo">
      <span className="icon fa-laptop"></span>
    </div>
    <div className="content">
      <div className="inner">
        <h2>
          <Typed strings={['I am Idris Olubisi']} typeSpeed={30} />
        </h2>
        <h3 style={{ color: 'gold' }}>
          <Typed
            strings={[
              'I am a public SPeaker',
              'I write code for a living',
              'I write technical content',
              'I love to write clean and reusable code',
              'I love to contribute to open source',
            ]}
            typeSpeed={100}
            backSpeed={60}
            loop
          />
        </h3>
        <p>
          a Software Engineer, Technical Writer, Speaker and Open-source
          contributor based in Lagos, Nigeria.
        </p>
      </div>
    </div>
    <nav>
      <ul>
        <li>
          <button>
            <a
              href="https://blog.idrisolubisi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              My Blog <span className="fa fa-pencil" aria-hidden="true"></span>
            </a>
          </button>
          {/* <Link to="https://blog.idrisolubisi.com/" target="_blank"> */}
          {/* <button
            // onClick={() => {
            //   props.onOpenArticle('intro')
            // }}
            >
              My Blog <span className="fa fa-pencil" aria-hidden="true"></span>
            </button>
          </Link> */}
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
              props.onOpenArticle('skill/certificate')
            }}
          >
            Experience <span className="fa fa-cogs" aria-hidden="true"></span>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('contact')
            }}
          >
            Hire me <span className="icon fa-address-card"></span>
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
