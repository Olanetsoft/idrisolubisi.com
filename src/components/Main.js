import PropTypes from 'prop-types'
import React from 'react'

import chatapp from '../../Content/assets/chatapp.png'
import naija from '../../Content/assets/supernaija.png'
import git from '../../Content/assets/git-user.png'
import math from '../../Content/assets/math.png'
import tutorx from '../../Content/assets/tutorx.png'
import hotzy from '../../Content/assets/hotzy.png'
import aboutPic from '../../Content/assets/aboutPic.jpg'

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
              href="https://datalab.socialsafety.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="lazyload" data-src={datalabs} alt="datalab" />
            </a>
          </span>
          <button>
            <a
              href="https://datalab.socialsafety.net"
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
              href="https://docs.socialsafety.net"
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
              href="https://docs.socialsafety.net"
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
            <img className="lazyload" data-src={aboutPic} alt="My_photo" />
            {/* <img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308684/Idris%20Portfolio%20Pictures/aboutPic.webp" alt="My_photo" /> */}
          </span>
          <h5>
            I strive for excellence and precision at all time, contributing the
            best of my ability and quota to improving organizational objective
            and achieving all goals set and target.
          </h5>
          <h3>Skill Set</h3>
          <h5>Front End: </h5>
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-html-5-48.png"
            alt="html"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429982/projects%20images/icons8-css3-48.png"
            alt="css"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-javascript-48.png"
            alt="js"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429982/projects%20images/icons8-bootstrap-48.png"
            alt="bootstrap"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-react-48.png"
            alt="react"
          />
          &nbsp;&nbsp;&nbsp;
          {/* <img src="https://img.icons8.com/ios-filled/48/000000/jquery.png" alt="jquery" /> */}
          <br />
          <br />
          <h5>Back End: </h5>
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-nodejs-48.png"
            alt="node"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429982/projects%20images/icons8-asp-48.png"
            alt="net"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-sql-48.png"
            alt="sql"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-graphql-48.png"
            alt="graphql"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://img.icons8.com/color/48/000000/mongodb.png"
            alt="mongodb"
          />{' '}
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://img.icons8.com/color/48/000000/heroku.png"
            alt="heroku"
          />{' '}
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://img.icons8.com/color/48/000000/azure-1.png"
            alt="azure"
          />
          <br />
          <br />
          <h5>Content Management System: </h5>
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-microsoft-sharepoint-48.png"
            alt="share"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-wordpress-48.png"
            alt="wordpress"
          />
          &nbsp;&nbsp;&nbsp;
          {/* <img src={gatsby} alt="gatsby" /> */}
          <br />
          <br />
          <h5>Development Tools: </h5>
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429982/projects%20images/icons8-git-48.png"
            alt="git"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429982/projects%20images/icons8-github-48.png"
            alt="github"
          />
          &nbsp;&nbsp;&nbsp;
          {/* <img src="https://img.icons8.com/color/48/000000/gitlab.png" alt="gitlab" />&nbsp;&nbsp;&nbsp; */}
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-trello-48.png"
            alt="trello"
          />
          &nbsp;&nbsp;&nbsp;
          {/* <img src="https://img.icons8.com/color/48/000000/bitbucket.png" alt="bit" />&nbsp;&nbsp;&nbsp; */}
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-microsoft-teams-48.png"
            alt="teams"
          />
          <br />
          <br />
          <h5>Programing Languages: </h5>
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429981/projects%20images/icons8-javascript-48.png"
            alt="js"
          />
          &nbsp;&nbsp;&nbsp;
          <img
            className="lazyload"
            data-src="https://res.cloudinary.com/olanetsoft/image/upload/v1594429982/projects%20images/icons8-c-sharp-logo-48.png"
            alt="csharp"
          />
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
          id="experience"
          className={`${
            this.props.article === 'skill/certificate' ? 'active' : ''
          } ${this.props.articleTimeout ? 'timeout' : ''}`}
          style={{ display: 'none' }}
        >
          <h2 className="major">
            Experience & <br />
            Achievements
          </h2>

          <span className="image main">
            {/* <img src={CertImage} alt="" /> */}
          </span>
          <h3>Philanthrolab</h3>
          <h4>
            ROLE: Back End Engineer
            <br />
            <br />
            Dates Employed: April 2021 – Present
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
            Dates Employed: May 2019 – Present
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
            Dates Employed: Jun 2020 – Sept 2020
            <br />
            <br />
            Location: Lagos, Nigeria
          </h4>
          <br />

          <h3>Ultra Media Solution</h3>
          <h4>
            Role: Web Development and Digital Marketing Intern
            <br />
            <br />
            Dates Employed: Mar 2019 – Apr 2019
            <br />
            <br />
            Location: 11 Unity Road ikeja lagos
          </h4>
          <br />

          <h3>CVIT</h3>
          <h4>
            Role: Network Administrator intern
            <br />
            <br />
            Dates Employed: Mar 2019 – Apr 2019
            <br />
            <br />
            Location: Ikeja lagos
          </h4>
          <br />
          <h3>FIIRO AUTOMATION</h3>
          <h4>
            Role: Graduate Electrical Engineer Trainee
            <br />
            <br />
            Dates Employed: Jun 2018 – Mar 2019
            <br />
            <br />
            Location: Lagos, Nigeria
          </h4>
          <br />
          <h3>Code lagos</h3>
          <h4>
            Role:Trainee
            <br />
            <br />
            Dates Employed: Oct 2018 – Nov 2018
            <br />
            <br />
            Location: Lagos,Nigeria
          </h4>
          <br />

          <h3>Cisco Networking Academy</h3>
          <h4>
            Role: Engineering Trainee
            <br />
            <br />
            Dates Employed: Sep 2018 – Nov 2018
          </h4>
          <br />

          <h3>Google Digital Skills For Africa</h3>
          <h4>
            Digital Marketing Trainee
            <br />
            <br />
            Dates Employed: Sep 2018 – Oct 2018
          </h4>
          <br />
          <h3>Al-Hikmah University</h3>
          <h4>
            Electrical & Electronics Engineer Trainee
            <br />
            <br />
            Dates Employed: Nov 2016 – Apr 2017
            <br />
            <br />
            Location: Kwara, Nigeria
          </h4>
          <br />

          <h3>More Blessing Engineering Works</h3>
          <h4>
            Role: Engineer Trainee
            <br />
            <br />
            Dates Employed: Jan 2016 – Mar 2016
            <br />
            <br />
            Location: Lagos, Nigeria
          </h4>
          <br />

          <p>
            <b>ACHIEVEMENTS</b>
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
