import PropTypes from 'prop-types'
import React from 'react'
//import pic01 from '../images/pic01.jpg'
// import pic02 from '../images/pic02.jpg'
// import pic03 from '../images/pic03.jpg'


//http://jsfiddle.net/5e6zr2Lq/1/


class Main extends React.Component {

  render() {
    let myFunction = () => {
      alert("Thanks For getting in Touch... You will get a feedback soon")
    }
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
            <img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308681/Idris%20Portfolio%20Pictures/digiitalClock.webp" alt="" />
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
          <h5><a href="https://github.com/Olanetsoft"
            target='_blank'
            rel="noopener noreferrer"
            className="icon fa-github"> Click here to View More on GitHub</a></h5>

          <span className="image main">
            <a href="https://www.rethinklagos.com"
              target='_blank'
              rel="noopener noreferrer" ><img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308684/Idris%20Portfolio%20Pictures/rethinkLagos.webp" alt="Rethink" /></a>
            {/* <img src="https://api.miniature.io/?width=100&height=30&url=rethinklagos.com"/> */}
          </span>
          <p>
            TITLE: RETHINK LAGOS <a href="https://www.rethinklagos.com" target='_blank'
              rel="noopener noreferrer"
              className="fa fa-eye"> View live || </a>
          </p>

          <span className="image main">
            <a href="https://www.boeinvest.com" target='_blank' rel="noopener noreferrer"><img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308681/Idris%20Portfolio%20Pictures/boeinvest.webp" alt="Boeinvest" /></a>
            {/* <img src="https://api.miniature.io/?width=100&height=30&url=rethinklagos.com"/> */}
          </span>
          <p>
            TITLE: BOE INVESTMENT NIGERIA  <a href="https://www.boeinvest.com" target='_blank' rel="noopener noreferrer" className="fa fa-eye"> View live || </a>
          </p>


          <span className="image main">
            <a href="https://digital-web-clock.netlify.com" target='_blank' rel="noopener noreferrer"><img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308681/Idris%20Portfolio%20Pictures/digiitalClock.webp" alt="DigitalClock" /></a>

          </span>
          <p>

            TITLE: DIGITAL CLOCK <a href="https://digital-web-clock.netlify.com"
              target='_blank' rel="noopener noreferrer"
              className="fa fa-eye"> View live || </a>
            <a href="https://github.com/Olanetsoft/Ticking-Clock-With-React"
              target='_blank' className="icon fa-github"
              rel="noopener noreferrer"> View on GitHub</a>

          </p>


          <span className="image main">
            <a href="https://www.naija4life.com.ng" target='_blank' rel="noopener noreferrer"><img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308683/Idris%20Portfolio%20Pictures/naija4life.webp" alt="Rethink" /></a>
          </span>
          <p>
            TITLE: NAIJA4LIFE BLOG <a href="https://www.naija4life.com.ng" target='_blank' rel="noopener noreferrer" className="fa fa-eye"> View live || </a>
          </p>


          <span className="image main">
            <a href="https://www.isazoni.com" target='_blank' rel="noopener noreferrer"><img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308681/Idris%20Portfolio%20Pictures/isazoni.webp" alt="isazoni" /></a>
          </span>
          <p>
            TITLE: ISAZ-ONI <a href="https://www.isazoni.com.ng" target='_blank' rel="noopener noreferrer" className="fa fa-eye"> View live || </a>
          </p>

          <span className="image main">
            <a href="https://www.kwarasell.com" target='_blank' rel="noopener noreferrer"><img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308684/Idris%20Portfolio%20Pictures/kwarasell.webp" alt="Kwarasell" /></a>
          </span>
          <p>
            TITLE: KWARASELL.COM <a href="https://www.kwarasell.com" target='_blank' rel="noopener noreferrer" className="fa fa-eye"> View live || </a>
          </p>

          <span className="image main">
            <a href="https://ponk-app.netlify.com" target='_blank' rel="noopener noreferrer"><img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308684/Idris%20Portfolio%20Pictures/ponkApp.webp" alt="ponkApp" /></a>
          </span>
          <p>
            TITLE: Ponk App <a href="https://ponk-app.netlify.com" target='_blank' rel="noopener noreferrer" className="fa fa-eye"> View Live || </a> <a href="https://github.com/Olanetsoft/Ponk-App" target='_blank'
              rel="noopener noreferrer"
              className="icon fa-github"> View on GitHub</a>
          </p>

          <span className="image main">

            <a href="https://music-event.netlify.com" target='_blank' rel="noopener noreferrer"><img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308685/Idris%20Portfolio%20Pictures/musicalEvent.webp" alt="MusicEvent" /></a>
          </span>
          <p>
            TITLE: Musical Event <a href="https://music-event.netlify.com" target='_blank'
              rel="noopener noreferrer"
              className="fa fa-eye"> View Live || </a> <a href="https://github.com/Olanetsoft/musical-event-project" target='_blank' rel="noopener noreferrer"
                className="icon fa-github"> View on GitHub</a>
          </p>


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
            <img src="https://res.cloudinary.com/olanetsoft/image/upload/v1580308684/Idris%20Portfolio%20Pictures/aboutPic.webp" alt="My_photo" />
          </span>
          <h3>skill set</h3>

          <h5>front End: </h5>
          <i class="fa fa-html5" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-css3" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-react" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-html5" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-html5" style={{ fontSize: "3em", color: "Tomato" }}></i>

          <h5>Back End: </h5>
          <i class="fa fa-react" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-html5" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-html5" style={{ fontSize: "3em", color: "Tomato" }}></i>

          <h5>Framework: </h5>
          <i class="fa fa-react" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-html5" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-html5" style={{ fontSize: "3em", color: "Tomato" }}></i>

          <h5>Content Management System: </h5>
          <i class="fab fa-react" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-wordpress" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-html5" style={{ fontSize: "3em", color: "Tomato" }}></i>

          <h5>Development Tool: </h5>
          <i class="fa fa-react" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa fa-git" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-gitlab" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-github" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-gitlab" style={{ fontSize: "3em", color: "Tomato" }}></i>

          <h5>Programing Language: </h5>
          <i class="fa fa-gitlab" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-github" style={{ fontSize: "3em", color: "Tomato" }}></i>
          <i class="fa fa-gitlab" style={{ fontSize: "3em", color: "Tomato" }}></i>

          <br />
          <h3>Tertiary Institution Details :</h3>
          <h5>Abubakar Tafawa Balewa University<br />
            Degree Name: Bachelor's degree<br />
            Field Of Study: Electrical and Electronics Engineering<br />
            Dates attended: 2012 – 2017
              <h3>Leadership Role:</h3>
            1. Social Director of the Nigerian Institute of Electrical and Electronics Engineering (NIEEE)Atbu Chapter 2015/2016 Academic Session<br />
            2. Vice-president of National Association of Kwara state Student (NAKSS)Atbu Chapter 2015.<br />
            3. Secretary General of Ilorin Emirate Student's Union(IESU) 2014/2015<br />
            4. Welfare Director of Isokan Students State Association(ISSA) 2014/2015<br />
            5. Director of Social, National Union of Lagos State students (NULASS) 2014/2015<br />
          </h5>


          <h3>College Details: </h3>
          <h5>Brainpoint College<br />
            Degree Name: West Africa Examination Council<br />
            Dates attended : 2006 – 2011<br />
          </h5>

          <h3>Primary school Details: </h3>
          <h5>Muslim Children Private School<br />
            Degree Name: First school leaving certificate<br />
            Dates attended or expected graduation 2000 – 2005<br />
          </h5>


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
          {close}
        </article>

        <article
          id="experience"
          className={`${this.props.article === 'skill/certificate' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
            }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Experience & <br />Achievements</h2>


          <span className="image main">
            {/* <img src={CertImage} alt="" /> */}
          </span>

          <h3>Tavia Technologies Limited</h3>
          <h4>ROLE: Software Developer/Support Analyst -SharePoint<br /><br />
            Company Name: Tavia Technologies Limited Full-time<br /><br />
            Dates Employed: May 2019 – Present<br /><br />
            Location: Lagos, Nigeria</h4>
          <br />

          <h3>Ultra Media Solution</h3>
          <h4>Role: Web Development and Digital Marketing Intern<br /><br />
            Company Name: Ultra Media Solution<br /><br />
            Dates Employed: Mar 2019 – Apr 2019<br /><br />
            Location: 11 Unity Road ikeja lagos</h4>
          <br />

          <h3>CVIT</h3>
          <h4>Role: Network Administrator intern<br />
            Company Name: CVIT <br /><br />
            Dates Employed: Mar 2019 – Apr 2019<br />
            Location: Ikeja lagos</h4>
          <br />
          <h3>FIIRO AUTOMATION</h3>
          <h4>Role: Graduate Electrical Engineer Trainee<br /><br />
            Company Name: FIIRO AUTOMATION Full-time<br /><br />
            Dates Employed: Jun 2018 – Mar 2019<br /><br />
            Location: Lagos, Nigeria</h4>
          <br />
          <h3>Code lagos</h3>
          <h4>Role:Trainee<br />
            Company Name: Code lagos Contract<br /><br />
            Dates Employed: Oct 2018 – Nov 2018<br /><br />
            Location: Lagos,Nigeria</h4>
          <br />

          <h3>Cisco Networking Academy</h3>
          <h4>Role: Engineering Trainee<br /><br />
            Company Name: Cisco Networking Academy Full-time<br /><br />
            Dates Employed: Sep 2018 – Nov 2018</h4>
          <br />

          <h3>Google Digital Skills For Africa</h3>
          <h4>Digital Marketing Trainee<br /><br />
            Company Name: Google Digital Skills For Africa<br /><br />
            Dates Employed: Sep 2018 – Oct 2018</h4>
          <br />
          <h3>Al-Hikmah University</h3>
          <h4>Electrical & Electronics Engineer Trainee<br /><br />
            Company Name: Al-Hikmah University<br /><br />
            Dates Employed: Nov 2016 – Apr 2017<br /><br />
            Location: Kwara, Nigeria</h4>
          <br />

          <h3>More Blessing Engineering Works</h3>
          <h4>Role: Engineer Trainee<br /><br />
            Company Name: More Blessing Engineering Works<br /><br />
            Dates Employed: Jan 2016 – Mar 2016<br /><br />
            Location: Lagos, Nigeria</h4>
          <br />



          <p>
            <b>ACHIEVEMENTS</b>
          </p>
          <h4>
            <a class="fa fa-trophy" aria-hidden="true" href="https://openclassrooms.com/en/course-certificates/7471028571"> Build web apps with ReactJS</a>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/M96TN8JSDWXP"> Front-End Web UI Frameworks and Tools:Bootstrap 4</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/records/69E4K5X3NBLY"> Responsive Website Basics: code with HTML,CSS & Js</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/BAP3BYQ2K4AJ"> Home Networking Basics</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/M3TZQUVANEW3"> Data Communications and Network Services</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/UFGB7QCD8RFK"> Network Protocols and Architecture</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/F5RX3YLQKCYP"> Internet Connection: How to Get Online?</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/35ZJQ28HWABE"> Preparing to Manage Human Resources</a>
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/2ERVRYUM39E9"> Project Management: The Basics for Success</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="http://GOO.GL/y4UjgN"> The Fundamentals of DIgital Marketing</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.sololearn.com/Certificate/1051-8503127/pdf/"> C++ Tutorial course</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.sololearn.com/Certificate/1023-8503127/pdf/"> CSS Fundamentals course</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.sololearn.com/Certificate/1014-8503127/pdf/"> HTML Fundamentals course</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="#"> SharePoint Development</a><br />
            <a class="fa fa-trophy" aria-hidden="true" href="https://www.coursera.org/account/accomplishments/verify/2RUKKMFTZALP"> Enterprise System Management and Security</a><br />

          </h4>
          <br />


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
            data-netlify-honeypot="bot-field" >
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
              <textarea name="message" id="message" rows="4" required></textarea>
            </div>
            <ul className="actions">
              <li>
                <input type="submit" value="Send Message" className="special" onClick={myFunction} />
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
