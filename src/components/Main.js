import PropTypes from 'prop-types'
import React from 'react'
import pic01 from '../images/pic01.jpg'
import pic02 from '../images/pic02.jpg'
import pic03 from '../images/pic03.jpg'
import RethinkLagos from '../images/rethinkLagos.png'
import Boeinvest from '../images/boeinvest.png'
import DigitalClock from '../images/digiitalClock.png'
import Isazoni from '../images/isazoni.png'
import KWARASELL from '../images/kwarasell.png'
import MusicalEvent from '../images/musicalEvent.png'
import Naija4life from '../images/naija4life.png'
//import SkillImage from '../images/skillimage2.jpg'
import CertImage from '../images/certImagenew.jpg';
import ABoutImage from '../images/aboutPic.jpg'




class Main extends React.Component {
  render() {
    let close = (
      <div
        className="close"
        onClick={() => {
          this.props.onCloseArticle()
        }}
      ></div>
    )

    return (
      <div
        ref={this.props.setWrapperRef}
        id="main"
        style={this.props.timeout ? { display: 'flex' } : { display: 'none' }}
      >
        <article
          id="intro"
          className={`${this.props.article === 'intro' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">MY Blog</h2>
          <span className="image main">
            <img src={pic01} alt="" />
          </span>
          <p>
            Aenean ornare velit lacus, ac varius enim ullamcorper eu. Proin
            aliquam facilisis ante interdum congue. Integer mollis, nisl amet
            convallis, porttitor magna ullamcorper, amet egestas mauris. Ut
            magna finibus nisi nec lacinia. Nam maximus erat id euismod egestas.
            By the way, check out my <a href="#work">awesome work</a>.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            dapibus rutrum facilisis. Class aptent taciti sociosqu ad litora
            torquent per conubia nostra, per inceptos himenaeos. Etiam tristique
            libero eu nibh porttitor fermentum. Nullam venenatis erat id
            vehicula viverra. Nunc ultrices eros ut ultricies condimentum.
            Mauris risus lacus, blandit sit amet venenatis non, bibendum vitae
            dolor. Nunc lorem mauris, fringilla in aliquam at, euismod in
            lectus. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. In non lorem sit amet elit
            placerat maximus. Pellentesque aliquam maximus risus, vel sed
            vehicula.
          </p>
          {close}
        </article>

        <article
          id="work"
          className={`${this.props.article === 'work' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >


          <h2 className="major">PROJECTS</h2>
          <span className="image main">
            <a href="https://www.rethinklagos.com" target='_blank'><img src={RethinkLagos} alt="Rethink"/></a>
            {/* <img src="https://api.miniature.io/?width=100&height=30&url=rethinklagos.com"/> */}
          </span>
          <p>
          PROJECT NAME: RETHINK LAGOS <a href="https://www.rethinklagos.com" target='_blank' className="fa fa-eye"> View live || </a>
          </p>
          

          <span className="image main">
            <a href="https://music-event.netlify.com" target='_blank'><img src={MusicalEvent} alt="MusicEvent"/></a>
          </span>
          <p>
          PROJECT NAME: Musical Event <a href="https://music-event.netlify.com" target='_blank' className="fa fa-eye"> View Live || </a> <a href="https://github.com/Olanetsoft/musical-event-project" target='_blank' className="icon fa-github"> View on GitHub</a>
          </p>


          <span className="image main">
            <a href="https://www.boeinvest.com" target='_blank'><img src={Boeinvest} alt="Boeinvest"/></a>
            {/* <img src="https://api.miniature.io/?width=100&height=30&url=rethinklagos.com"/> */}
          </span>
          <p>
            PROJECT NAME: BOE INVESTMENT NIGERIA  <a href="https://www.boeinvest.com" target='_blank' className="fa fa-eye"> View live || </a>
          </p>


          <span className="image main">
            <a href="https://digital-web-clock.netlify.com" target='_blank'><img src={DigitalClock} alt="DigitalClock"/></a>
            
          </span>
          <p>

          PROJECT NAME: DIGITAL CLOCK <a href="https://digital-web-clock.netlify.com" target='_blank' className="fa fa-eye"> View live || </a> <a href="https://github.com/Olanetsoft/Ticking-Clock-With-React" target='_blank' className="icon fa-github"> View on GitHub</a>
           
          </p>


          <span className="image main">
            <a href="https://www.naija4life.com.ng" target='_blank'><img src={Naija4life} alt="Rethink"/></a>
          </span>
          <p>
          PROJECT NAME: NAIJA4LIFE BLOG <a href="https://www.naija4life.com.ng" target='_blank' className="fa fa-eye"> View live || </a>
          </p>


          <span className="image main">
            <a href="https://www.isazoni.com" target='_blank'><img src={Isazoni} alt="isazoni"/></a>
          </span>
          <p>
            PROJECT NAME: ISAZ-ONI <a href="https://www.isazoni.com.ng" target='_blank' className="fa fa-eye"> View live || </a>
          </p>

          <span className="image main">
            <a href="https://www.kwarasell.com" target='_blank'><img src={KWARASELL} alt="Kwarasell"/></a>
          </span>
          <p>
            PROJECT NAME: KWARASELL.COM <a href="https://www.kwarasell.com" target='_blank' className="fa fa-eye"> View live || </a>
          </p>

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
            <img src={ABoutImage} alt="" />
          </span>
          <p>
            Lorem ipsum dolor sit amet, consectetur et adipiscing elit. Praesent
            eleifend dignissim arcu, at eleifend sapien imperdiet ac. Aliquam
            erat volutpat. Praesent urna nisi, fringila lorem et vehicula
            lacinia quam. Integer sollicitudin mauris nec lorem luctus ultrices.
            Aliquam libero et malesuada fames ac ante ipsum primis in faucibus.
            Cras viverra ligula sit amet ex mollis mattis lorem ipsum dolor sit
            amet.
          </p>
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
          {close}
        </article>

        <article
          id="about"
          className={`${this.props.article === 'skill/certificate' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Achievements</h2>
          

          <span className="image main">
            <img src={CertImage} alt="" />
          </span>
          <p>
            ACHIEVEMENTS<br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://openclassrooms.com/en/course-certificates/7471028571"> Build web apps with ReactJS</a>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/M96TN8JSDWXP"> Front-End Web UI Frameworks and Tools: Bootstrap 4</a>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/records/69E4K5X3NBLY"> Responsive Website Basics: code with HTML,CSS and Javascript</a>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/BAP3BYQ2K4AJ"> Home Networking Basics</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/M3TZQUVANEW3"> Data Communications and Network Services</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/UFGB7QCD8RFK"> Network Protocols and Architecture</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/F5RX3YLQKCYP"> Internet Connection: How to Get Online?</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/35ZJQ28HWABE"> Preparing to Manage Human Resources</a>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/2ERVRYUM39E9"> Project Management: The Basics for Success</a>
            <a class="fa fa-trophy" aria-hidden="true" href="http://GOO.GL/y4UjgN"> The Fundamentals of DIgital Marketing</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.sololearn.com/Certificate/1051-8503127/pdf/"> C++ Tutorial course</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.sololearn.com/Certificate/1023-8503127/pdf/"> CSS Fundamentals course</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.sololearn.com/Certificate/1014-8503127/pdf/"> HTML Fundamentals course</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="#"> SharePoint Development</a><br/>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/2RUKKMFTZALP"> Enterprise System Management and Security</a>
             
            
              
          </p>

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
          method="post" 
          action="#" 
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          >
            <div className="field half first">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" />
            </div>
            <div className="field half">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea name="message" id="message" rows="4"></textarea>
            </div>
            <ul className="actions">
              <li>
                <input type="submit" value="Send Message" className="special" />
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
            
          </ul>{close}
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
