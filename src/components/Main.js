import PropTypes from 'prop-types'
import React from 'react'

import chatapp from '../../Content/assets/chatapp.png'
import naija from '../../Content/assets/supernaija.png'
import git from '../../Content/assets/git-user.png'
import math from '../../Content/assets/math.png'
import tutorx from '../../Content/assets/tutorx.png'
import hotzy from '../../Content/assets/hotzy.png'
// import aboutPic from '../../Content/assets/aboutPic.jpg'

// import { FaReact, FaNodeJs, FaGitSquare, FaGithub } from 'react-icons/fa'
// import { IoLogoJavascript } from 'react-icons/io'
// import { SiTypescript, SiSolidity, SiMicrosoftsharepoint } from 'react-icons/si'
// import { GrGraphQl } from 'react-icons/gr'

//http://jsfiddle.net/5e6zr2Lq/1/
import datalabs from '../../Content/assets/datalabs.png'
import customerpayme from '../../Content/assets/customerpayme.png'
import fundmylaptop from '../../Content/assets/fundmylaptop.png'
import socialsafety from '../../Content/assets/socialsafety.png'

class Main extends React.Component {
  render() {
    let myFunction = () => {
      alert('Thanks For getting in Touch... You will get a feedback soon !')
    }
    let close = (
      <div
        role="button"
        className="close"
        onClick={() => {
          this.props.onCloseArticle()
        }}
        tabIndex={0}
        aria-hidden="true"
      >
        {' '}
      </div>
    )

    return (
      <div
        ref={this.props.setWrapperRef}
        id="main"
        style={this.props.timeout ? { display: 'flex' } : { display: 'none' }}
      >
        <article
          id="work"
          className={`${this.props.article === 'work' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">PROJECTS</h2>
          <span className="image main">
            <a
              href="https://customerpay.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="lazyload"
                data-src={customerpayme}
                alt="customerpayme"
              />
            </a>
          </span>
          <button>
            <a
              href="https://customerpay.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          <span className="image main">
            <a
              href="https://datalabs.socialsafety.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="lazyload" data-src={datalabs} alt="datalab" />
            </a>
          </span>
          <button>
            <a
              href="https://datalabs.socialsafety.net"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          <span className="image main">
            <a
              href="https://fundmylaptop.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="lazyload"
                data-src={fundmylaptop}
                alt="fundmylaptop"
              />
            </a>
          </span>
          <button>
            <a
              href="https://fundmylaptop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              Visit Site{' '}
            </a>
          </button>
          <span className="image main">
            <a
              href="https://supernigerians.herokuapp.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="lazyload"
                data-src={naija}
                alt="super nigerians"
              />
            </a>
          </span>
          <button>
            <a
              href="https://supernigerians.herokuapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button>
            <a
              href="https://github.com/Olanetsoft/SuperNigerians"
              target="_blank"
              className="icon fa-github"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              View Source Code
            </a>
          </button>
          <span className="image main">
            <a
              href="https://socialsafety.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="lazyload"
                data-src={socialsafety}
                alt="socialsafety"
              />
            </a>
          </span>
          <button>
            <a
              href="https://socialsafety.net"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          <span className="image main">
            <a
              href="https://hotzy-store.herokuapp.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="lazyload" data-src={hotzy} alt="hotzy" />
            </a>
          </span>
          <button>
            <a
              href="https://hotzy-store.herokuapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button>
            <a
              href="https://github.com/Olanetsoft/hotzy-store"
              target="_blank"
              className="icon fa-github"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              View Source Code
            </a>
          </button>
          <span className="image main">
            <a
              href="https://tutor-x.netlify.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="lazyload" data-src={tutorx} alt="tutorX" />
            </a>
          </span>
          <button>
            <a
              href="https://tutor-x.netlify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button>
            <a
              href="https://github.com/Olanetsoft/Tutor-X"
              target="_blank"
              className="icon fa-github"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              View Source Code
            </a>
          </button>
          <span className="image main">
            <a
              href="https://web-chat.global.assistant.watson.cloud.ibm.com/preview.html?region=eu-gb&integrationID=08c8e484-3c52-4685-8cc5-be6974aaeb8f&serviceInstanceID=248098c0-92c6-4213-96bb-961a448bc72d"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="lazyload" data-src={chatapp} alt="wakalagos" />
            </a>
          </span>
          <button>
            <a
              href="https://web-chat.global.assistant.watson.cloud.ibm.com/preview.html?region=eu-gb&integrationID=08c8e484-3c52-4685-8cc5-be6974aaeb8f&serviceInstanceID=248098c0-92c6-4213-96bb-961a448bc72d"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          <span className="image main">
            <a
              href="https://math-puzzle.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="lazyload" data-src={math} alt="mathGame" />
            </a>
            {/* <img src="https://res.cloudinary.com/olanetsoft/image/upload/v1594426817/projects%20images/math.webp"
                alt="mathGame" /></a> */}
          </span>
          <button>
            <a
              href="https://math-puzzle.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button>
            <a
              href="https://github.com/Olanetsoft/math-game"
              target="_blank"
              className="icon fa-github"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              View Source Code
            </a>
          </button>
          <span className="image main">
            <a
              href="https://git-user.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="lazyload" data-src={git} alt="git" />
            </a>
          </span>
          <button>
            <a
              href="https://git-user.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="fa fa-eye"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              Visit Site{' '}
            </a>
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button>
            <a
              href="https://github.com/Olanetsoft/git-card"
              target="_blank"
              className="icon fa-github"
              rel="noopener noreferrer"
              style={{ borderBottom: 'none' }}
            >
              {' '}
              View Source Code
            </a>
          </button>
          <br /> <br />
          <ul className="icons">
            <li>
              <a
                href="https://twitter.com/olanetsoft"
                className="icon fa-twitter"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://github.com/olanetsoft"
                className="icon fa-github"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@olanetsoft"
                className="icon fa-medium"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/olubisiidris"
                className="icon fa-facebook"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/olanetsoft"
                className="icon fa-instagram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/olubisi-idris-ayinde-05727b17a/"
                className="icon fa-linkedin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                {' '}
              </a>
            </li>
          </ul>
          {close}
        </article>

        <article
          id="about"
          className={`${this.props.article === 'about' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">About</h2>
          <span className="image main">
            {/* <img className="lazyload" data-src={aboutPic} alt="My_photo" /> */}
            {/* <img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308684/Idris%20Portfolio%20Pictures/aboutPic.webp" alt="My_photo" /> */}
          </span>
          <h5>
            Idris is a skilled software engineer, developer advocate, technical
            writer, and developer advocate with expertise in open source,
            blockchain, software products, and serverless technologies.
            <br /> <br />
            As a Developer Advocate, Idris brings industry knowledge and a
            passion for empowering fellow developers. With a proven track record
            of contributing to reputable publications and engaging with the
            developer community, Idris is highly sought-after as a developer
            relations engineer.
          </h5>
          {/* <h3>Technologies & Skills</h3> */}
          &nbsp;&nbsp;&nbsp;
          <br />
          <br />
          <ul className="icons">
            <li>
              <a
                href="https://twitter.com/olanetsoft"
                className="icon fa-twitter"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://github.com/olanetsoft"
                className="icon fa-github"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@olanetsoft"
                className="icon fa-medium"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
              >
                {' '}
              </a>
            </li>

            <li>
              <a
                href="https://www.linkedin.com/in/olubisi-idris-ayinde-05727b17a/"
                className="icon fa-linkedin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                {' '}
              </a>
            </li>
          </ul>
          {close}
        </article>

        <article
          id="experience"
          className={`${
            this.props.article === 'skill/certificate' ? 'active' : ''
          } ${this.props.articleTimeout ? 'timeout' : ''}`}
          style={{ display: 'none' }}
        >
          <h2 className="major">
            Experience & <br />
            Certifications
          </h2>

          <span className="image main">
            {/* <img src={CertImage} alt="" /> */}
          </span>
          <h3>Axelar</h3>
          <h4>
            ROLE: Developer Advocate
            <br />
            <br />
            Dates: Apr 2023 - Present
            <br />
            <br />
            Location: Waterloo, Ontario, Canada
          </h4>
          <br />
          <h3>Mara</h3>
          <h4>
            ROLE: Developer Relation Engineer
            <br />
            <br />
            Dates: Jul 2022 - Apr 2023
            <br />
            <br />
            Location: Nairobi, Kenya
          </h4>
          <br />

          <h3>Luna</h3>
          <h4>
            ROLE: Back End Engineer
            <br />
            <br />
            Dates Employed: Dec 2021 - Jul 2022
            <br />
            <br />
            Location: London, England, United Kingdom
          </h4>
          <br />

          <h3>Philanthrolab</h3>
          <h4>
            ROLE: Back End Engineer
            <br />
            <br />
            Dates: April 2021 – Dec 2021
            <br />
            <br />
            Location: Dallas, Texas.
          </h4>
          <br />

          <h3>Tavia Technologies Limited</h3>
          <h4>
            ROLE: Software Developer/Support Analyst -SharePoint
            <br />
            <br />
            Dates: May 2019 – August 2021
            <br />
            <br />
            Location: Lagos, Nigeria
          </h4>
          <br />

          <h3>Hotels.ng</h3>
          <h4>
            ROLE: Backend Developer
            <br />
            <br />
            Dates: Jun 2020 – Sept 2020
            <br />
            <br />
            Location: Lagos, Nigeria
          </h4>
          <br />

          <p>
            <b>Certification</b>
          </p>
          <h4>
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.freecodecamp.org/certification/olanetsoft/javascript-algorithms-and-data-structures"
            >
              {' '}
              JavaScript Algorithms & Data Structures{' '}
            </a>
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.freecodecamp.org/certification/olanetsoft/apis-and-microservices"
            >
              {' '}
              APIs and Microservices{' '}
            </a>
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://openclassrooms.com/en/course-certificates/7471028571"
            >
              {' '}
              Build web apps with ReactJS
            </a>
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/verify/M96TN8JSDWXP"
            >
              {' '}
              Front-End Web UI Frameworks and Tools:Bootstrap 4
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/records/69E4K5X3NBLY"
            >
              {' '}
              Responsive Website Basics: code with HTML,CSS & Js
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://academy.infinite.red/courses/679257/certificate"
            >
              {' '}
              AI Demystified: 5-Day Mini-Course
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/verify/BAP3BYQ2K4AJ"
            >
              {' '}
              Home Networking Basics
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/verify/M3TZQUVANEW3"
            >
              {' '}
              Data Communications and Network Services
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/verify/UFGB7QCD8RFK"
            >
              {' '}
              Network Protocols and Architecture
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/verify/F5RX3YLQKCYP"
            >
              {' '}
              Internet Connection: How to Get Online?
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/verify/35ZJQ28HWABE"
            >
              {' '}
              Preparing to Manage Human Resources
            </a>
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/verify/2ERVRYUM39E9"
            >
              {' '}
              Project Management: The Basics for Success
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="http://GOO.GL/y4UjgN"
            >
              {' '}
              The Fundamentals of DIgital Marketing
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.sololearn.com/Certificate/1051-8503127/pdf/"
            >
              {' '}
              C++ Tutorial course
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.sololearn.com/Certificate/1023-8503127/pdf/"
            >
              {' '}
              CSS Fundamentals course
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.sololearn.com/Certificate/1014-8503127/pdf/"
            >
              {' '}
              HTML Fundamentals course
            </a>
            <br />
            <br />
            <br />
            <a className="fa fa-trophy" aria-hidden="true" href="/#">
              {' '}
              SharePoint Development
            </a>
            <br />
            <br />
            <br />
            <a
              className="fa fa-trophy"
              aria-hidden="true"
              href="https://www.coursera.org/account/accomplishments/verify/2RUKKMFTZALP"
            >
              {' '}
              Enterprise System Management and Security
            </a>
            <br />
          </h4>
          <br />
          <br />

          <ul className="icons">
            <li>
              <a
                href="https://twitter.com/olanetsoft"
                className="icon fa-twitter"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://github.com/olanetsoft"
                className="icon fa-github"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@olanetsoft"
                className="icon fa-medium"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
              >
                {' '}
              </a>
            </li>

            <li>
              <a
                href="https://www.linkedin.com/in/olubisi-idris-ayinde-05727b17a/"
                className="icon fa-linkedin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                {' '}
              </a>
            </li>
          </ul>
          {close}
        </article>

        <article
          id="contact"
          className={`${this.props.article === 'contact' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Contact</h2>
          <form
            name="contact"
            method="post"
            action="/"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
          >
            <input type="hidden" name="bot-field" />
            <input type="hidden" name="form-name" value="contact" />

            <div className="field half first">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" required />
            </div>
            <div className="field half">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" required />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                rows="4"
                required
              ></textarea>
            </div>
            <ul className="actions">
              <li>
                <input
                  type="submit"
                  value="Send Message"
                  className="special"
                  onClick={myFunction}
                />
              </li>
              <li>
                <input type="reset" value="Reset" />
              </li>
            </ul>
          </form>
          <ul className="icons">
            <li>
              <a
                href="https://twitter.com/olanetsoft"
                className="icon fa-twitter"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://github.com/olanetsoft"
                className="icon fa-github"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
              >
                {' '}
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@olanetsoft"
                className="icon fa-medium"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
              >
                {' '}
              </a>
            </li>

            <li>
              <a
                href="https://www.linkedin.com/in/olubisi-idris-ayinde-05727b17a/"
                className="icon fa-linkedin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                {' '}
              </a>
            </li>
          </ul>
          {close}
        </article>
      </div>
    )
  }
}

Main.propTypes = {
  route: PropTypes.object,
  article: PropTypes.string,
  articleTimeout: PropTypes.bool,
  onCloseArticle: PropTypes.func,
  timeout: PropTypes.bool,
  setWrapperRef: PropTypes.func.isRequired,
}

export default Main
