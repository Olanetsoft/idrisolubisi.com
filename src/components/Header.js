import PropTypes from 'prop-types'
import React from 'react'
import { ReactTyped } from 'react-typed'

const Header = (props) => (
  <header id="header" style={props.timeout ? { display: 'none' } : {}}>
    <div className="logo">
      <span className="icon fa-laptop"></span>
    </div>
    <div className="content">
      <div className="inner">
        <h2>
          <ReactTyped strings={["I'm Idris Olubisi"]} typeSpeed={30} />
        </h2>
        <h3 style={{ color: 'gold' }}>
          <ReactTyped
            strings={[
              'I am a public speaker',
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
          a Software Engineer, Developer Advocate, Technical Writer, Speaker and
          Open-source contributor.
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
              style={{ borderBottom: 'none' }}
            >
              Blog <span className="fa fa-pencil" aria-hidden="true"></span>
            </a>
          </button>
        </li>
        {/* <li>
          <button
            onClick={() => {
              props.onOpenArticle('work')
            }}
          >
            PROJECTS <span className="icon fa-laptop"></span>
          </button>
        </li> */}
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('about')
            }}
          >
            About <span className="icon fa-user"></span>
          </button>
        </li>
        <li>
          <button>
            <a
              href="https://www.linkedin.com/in/idris-olubisi/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              Experience <span className="fa fa-cogs" aria-hidden="true"></span>
            </a>
          </button>
        </li>
        {/* <li>
          <button>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              Talks{' '}
              <span className="fas fa-microphone-alt" aria-hidden="true"></span>
            </a>
          </button>
        </li> */}
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('contact')
            }}
          >
            Let's Chat <span className="icon fa-address-card"></span>
          </button>
        </li>

        <li>
          <button>
            <a
              // href="https://drive.google.com/file/d/1grvPPBBzk6_L4gqtpe-kd45iPN0fJen9/view?usp=sharing"
              // href="https://docs.google.com/document/d/10GebT28NusuOgkEBJWaXusuhNTIxxPh_3u1irbi4vy0/edit?usp=sharing"
              href="https://docs.google.com/document/d/1dcUOmgfnAsRihGTNqbpKRo_2-zF8boUz/edit?usp=sharing&ouid=104261988764575898297&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              Resume <span className="fa fa-file" aria-hidden="true"></span>
            </a>
          </button>
        </li>
        <li>
          {/* <button>
            <a
              href="https://www.buymeacoffee.com/olanetsoft"
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                style={{
                  height: '2.75rem',
                  minWidth: '7.5rem',
                }}
              />
            </a>
          </button> */}
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
