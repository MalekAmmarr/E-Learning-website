'use client'; // This marks the component as a client component
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export interface Instructor {
  _id: string;
  email: string;
  name: string;
  age: string; // Assuming age is a string, but can be converted to number if necessary
  passwordHash: string;
  Teach_Courses: string[]; // List of course names the instructor teaches
  Certificates: string; // Certificates the instructor holds
  createdAt: string; // ISO Date format
  updatedAt: string; // ISO Date format
  __v: number; // MongoDB version field (not typically required in app logic)
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    const accessToken = localStorage.getItem('Ins_Token');
    const Instructor = localStorage.getItem('instructorData');
    if (Instructor) {
      if (accessToken) {
        setInstructor(JSON.parse(Instructor));
      } // Set userData state only if data exists}
    } else {
      router.push('/Ins_login');
    }
  }, []);
  return (
    <>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <title>Intructor Platform</title>
      {/* Bootstrap core CSS */}
      <link href="/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
      {/* Additional CSS Files */}
      <link rel="stylesheet" href="/assets/css/fontawesome.css" />
      <link rel="stylesheet" href="/assets/css/templatemo-scholar.css" />
      <link rel="stylesheet" href="/assets/css/owl.css" />
      <link rel="stylesheet" href="/assets/css/animate.css" />
      <link
        rel="stylesheet"
        href="https://unpkg.com/swiper@7/swiper-bundle.min.css"
      />
      {/*
  
  TemplateMo 586 Scholar
  
  https://templatemo.com/tm-586-scholar
  
  */}
      {/* ***** Preloader Start ***** */}
      {isLoading && (
        <div id="js-preloader" className="js-preloader">
          <div className="preloader-inner">
            <span className="dot" />
            <div className="dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
      {/* ***** Preloader End ***** */}
      {/* ***** Header Area Start ***** */}
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                {/* ***** Logo Start ***** */}
                <a className="logo">
                  <h1>Instructor</h1>
                </a>
                {/* ***** Logo End ***** */}
                {/* ***** Serach Start ***** */}
                <div className="search-input">
                  <form id="search" action="#">
                    <input
                      type="text"
                      placeholder="Type Something"
                      id="searchText"
                      name="searchKeyword"
                    />
                    <i className="fa fa-search" />
                  </form>
                </div>
                {/* ***** Serach Start ***** */}
                {/* ***** Menu Start ***** */}
                <ul className="nav">
                  <li className="scroll-to-section">
                    <a href="#top" className="active">
                      Home
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#services">Services</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#courses">Courses</a>
                  </li>
                  <li>
                    <Link href="#top">{instructor?.name}</Link>
                  </li>
                </ul>
                <a className="menu-trigger">
                  <span>Menu</span>
                </a>
                {/* ***** Menu End ***** */}
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* ***** Header Area End ***** */}
      <div className="main-banner" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="owl-carousel owl-banner">
                <div className="item item-1">
                  <div className="header-text">
                    <span className="category">Our Courses</span>
                    <h2>With Scholar Teachers, Everything Is Easier</h2>
                    <p>
                      Scholar is free CSS template designed by TemplateMo for
                      online educational related websites. This layout is based
                      on the famous Bootstrap v5.3.0 framework.
                    </p>
                    <div className="buttons">
                      <div className="main-button">
                        <a href="#">Request Demo</a>
                      </div>
                      <div className="icon-button">
                        <a href="#">
                          <i className="fa fa-play" /> What's Scholar?
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item item-2">
                  <div className="header-text">
                    <span className="category">Best Result</span>
                    <h2>Get the best result out of your effort</h2>
                    <p>
                      You are allowed to use this template for any educational
                      or commercial purpose. You are not allowed to
                      re-distribute the template ZIP file on any other website.
                    </p>
                    <div className="buttons">
                      <div className="main-button">
                        <a href="#">Request Demo</a>
                      </div>
                      <div className="icon-button">
                        <a href="#">
                          <i className="fa fa-play" /> What's the best result?
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item item-3">
                  <div className="header-text">
                    <span className="category">Online Learning</span>
                    <h2>Online Learning helps you save the time</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod temporious incididunt ut labore et dolore
                      magna aliqua suspendisse.
                    </p>
                    <div className="buttons">
                      <div className="main-button">
                        <a href="#">Request Demo</a>
                      </div>
                      <div className="icon-button">
                        <a href="#">
                          <i className="fa fa-play" /> What's Online Course?
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="services section" id="services">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="service-item">
                <div className="icon">
                  <img
                    src="/assets/images/service-01.png"
                    alt="online degrees"
                  />
                </div>
                <div className="main-content">
                  <h4>Applied Students</h4>
                  <p>
                    Go check if there are applied students to your courses.They
                    are waiting for you to accept or Reject
                  </p>
                  <div className="main-button">
                    <a href="/Ins_Home/Ins_applied-students">Check</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-item">
                <div className="icon">
                  <img
                    src="/assets/images/service-02.png"
                    alt="short courses"
                  />
                </div>
                <div className="main-content">
                  <h4>Add Content</h4>
                  <p>You can add content to the courses you teach FromHere</p>
                  <div className="main-button">
                    <a href="/Ins_Home/Add_content">Check</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-item">
                <div className="icon">
                  <img src="/assets/images/service-03.png" alt="web experts" />
                </div>
                <div className="main-content">
                  <h4>Students grades</h4>
                  <p>You can Add Grades of Quizes and Exams from Here.</p>
                  <div className="main-button">
                    <a href="/Ins_Home/Put_grades">Put Grades</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section courses" id="courses">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="section-heading">
                <h6>Latest Courses</h6>
                <h2>Latest Courses</h2>
              </div>
            </div>
          </div>
          <ul className="event_filter">
            <li>
              <a className="is_active" href="#!" data-filter="*">
                Show All
              </a>
            </li>
            <li>
              <a href="#!" data-filter=".design">
                Webdesign
              </a>
            </li>
            <li>
              <a href="#!" data-filter=".development">
                Development
              </a>
            </li>
            <li>
              <a href="#!" data-filter=".wordpress">
                Wordpress
              </a>
            </li>
          </ul>
          <div className="row event_box">
            <div className="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 design">
              <div className="events_item">
                <div className="thumb">
                  <a href="#">
                    <img src="/assets/images/course-01.jpg" alt="" />
                  </a>
                  <span className="category">Webdesign</span>
                  <span className="price">
                    <h6>
                      <em>$</em>160
                    </h6>
                  </span>
                </div>
                <div className="down-content">
                  <span className="author">Stella Blair</span>
                  <h4>Learn Web Design</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6  development">
              <div className="events_item">
                <div className="thumb">
                  <a href="#">
                    <img src="/assets/images/course-02.jpg" alt="" />
                  </a>
                  <span className="category">Development</span>
                  <span className="price">
                    <h6>
                      <em>$</em>340
                    </h6>
                  </span>
                </div>
                <div className="down-content">
                  <span className="author">Cindy Walker</span>
                  <h4>Web Development Tips</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 design wordpress">
              <div className="events_item">
                <div className="thumb">
                  <a href="#">
                    <img src="/assets/images/course-03.jpg" alt="" />
                  </a>
                  <span className="category">Wordpress</span>
                  <span className="price">
                    <h6>
                      <em>$</em>640
                    </h6>
                  </span>
                </div>
                <div className="down-content">
                  <span className="author">David Hutson</span>
                  <h4>Latest Web Trends</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 development">
              <div className="events_item">
                <div className="thumb">
                  <a href="#">
                    <img src="/assets/images/course-04.jpg" alt="" />
                  </a>
                  <span className="category">Development</span>
                  <span className="price">
                    <h6>
                      <em>$</em>450
                    </h6>
                  </span>
                </div>
                <div className="down-content">
                  <span className="author">Stella Blair</span>
                  <h4>Online Learning Steps</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 wordpress development">
              <div className="events_item">
                <div className="thumb">
                  <a href="#">
                    <img src="/assets/images/course-05.jpg" alt="" />
                  </a>
                  <span className="category">Wordpress</span>
                  <span className="price">
                    <h6>
                      <em>$</em>320
                    </h6>
                  </span>
                </div>
                <div className="down-content">
                  <span className="author">Sophia Rose</span>
                  <h4>Be a WordPress Master</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 wordpress design">
              <div className="events_item">
                <div className="thumb">
                  <a href="#">
                    <img src="/assets/images/course-06.jpg" alt="" />
                  </a>
                  <span className="category">Webdesign</span>
                  <span className="price">
                    <h6>
                      <em>$</em>240
                    </h6>
                  </span>
                </div>
                <div className="down-content">
                  <span className="author">David Hutson</span>
                  <h4>Full Stack Developer</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="section fun-facts">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper">
                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <div className="counter">
                      <h2
                        className="timer count-title count-number"
                        data-to={150}
                        data-speed={1000}
                      />
                      <p className="count-text ">Happy Students</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="counter">
                      <h2
                        className="timer count-title count-number"
                        data-to={804}
                        data-speed={1000}
                      />
                      <p className="count-text ">Course Hours</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="counter">
                      <h2
                        className="timer count-title count-number"
                        data-to={50}
                        data-speed={1000}
                      />
                      <p className="count-text ">Employed Students</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="counter end">
                      <h2
                        className="timer count-title count-number"
                        data-to={15}
                        data-speed={1000}
                      />
                      <p className="count-text ">Years Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="team section" id="team">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="team-member">
                <div className="main-content">
                  <img src="/assets/images/member-01.jpg" alt="" />
                  <span className="category">UX Teacher</span>
                  <h4>Sophia Rose</h4>
                  <ul className="social-icons">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-member">
                <div className="main-content">
                  <img src="/assets/images/member-02.jpg" alt="" />
                  <span className="category">Graphic Teacher</span>
                  <h4>Cindy Walker</h4>
                  <ul className="social-icons">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-member">
                <div className="main-content">
                  <img src="/assets/images/member-03.jpg" alt="" />
                  <span className="category">Full Stack Master</span>
                  <h4>David Hutson</h4>
                  <ul className="social-icons">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-member">
                <div className="main-content">
                  <img src="/assets/images/member-04.jpg" alt="" />
                  <span className="category">Digital Animator</span>
                  <h4>Stella Blair</h4>
                  <ul className="social-icons">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="container">
          <div className="col-lg-12">
            <p>
              Copyright © Omar Hossam. All rights reserved To Intifada Team
              &nbsp;&nbsp;&nbsp; Design:{' '}
              <a href="https://templatemo.com" rel="nofollow" target="_blank">
                Hossam & Behziouni
              </a>
            </p>
          </div>
        </div>
      </footer>
      {/* Scripts */}
      {/* Bootstrap core JavaScript */}
      {/* Add the jQuery script */}
      <Script
        src="/vendor/jquery/jquery.min.js"
        strategy="beforeInteractive" // Load this before the page is interactive because other scripts might depend on it
      />

      {/* Add the Bootstrap script */}
      <Script
        src="/vendor/bootstrap/js/bootstrap.min.js"
        strategy="beforeInteractive" // Load this before the page is interactive
      />

      {/* Add Isotope.js */}
      <Script
        src="/assets/js/isotope.min.js"
        strategy="afterInteractive" // Load after the page is interactive
      />

      {/* Add Owl Carousel script */}
      <Script src="/assets/js/owl-carousel.js" strategy="afterInteractive" />

      {/* Add counter script */}
      <Script src="/assets/js/counter.js" strategy="afterInteractive" />

      {/* Add custom.js for custom functionality */}
      <Script src="/assets/js/custom.js" strategy="afterInteractive" />
    </>
  );
}
