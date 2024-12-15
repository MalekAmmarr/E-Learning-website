'use client'; // This marks the component as a client component
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [userData, setUserData] = useState<any>(null);

  const router = useRouter();
  const courses = [
    {
      name: 'Machine Learning',
      category: 'Data Science',
      price: 160,
      image: '/assets/images/ML.jpg',
      intructor_name: 'Prof.Omar Hossam',
    },
    {
      name: 'Data Engineering and Visualization',
      category: 'Data Science',
      price: 340,
      image: '/assets/images/Visualization.jpg',
      intructor_name: 'Prof.Omar Hossam',
    },
    {
      name: 'Programming 1',
      category: 'Programming',
      price: 320,
      image: '/assets/images/Prog_1.jpg',
      intructor_name: 'Dr.Boudy marley',
    },
    {
      name: 'Programming 2',
      category: 'Programming',
      price: 450,
      image: '/assets/images/Prog_2.jpg',
      intructor_name: 'Dr.Malek Lukasy',
    },
    {
      name: 'English Beginner',
      category: 'English',
      price: 600,
      image: '/assets/images/English (2).jpg',
      intructor_name: 'Dr.Ali 3elwa',
    },
    {
      name: 'English Advanced',
      category: 'English',
      price: 240,
      image: '/assets/images/English (2).jpg',
      intructor_name: 'Dr.Behziouni',
    },
  ];
  // Filter courses based on the active category
  const filteredCourses =
    activeCategory === 'All'
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    const accessToken = sessionStorage.getItem('authToken');
    const user = sessionStorage.getItem('userData');
    if (user) {
      if (accessToken) {
        setUserData(JSON.parse(user));
      } // Set userData state only if data exists}
    } else {
      router.push('/login');
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
      <title>Student:{userData?.name}</title>
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
                  <h1>Student</h1>
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
                  <li className="scroll-to-section">
                    <a href="#team">Team</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#events">Events</a>
                  </li>
                  <li>
                    <Link href="/User_Home/Profile">
                      {userData?.name || 'User'}
                    </Link>
                  </li>
                  <li>
                    <Link href="/login">Notification</Link>
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
                      We offer a lot of courses in various fields and majors to
                      help you excel and achieve your goals. Whether you're
                      looking to advance your career, improve your skills, or
                      explore a new hobby, Scholar Teachers has something for
                      everyone.
                    </p>
                    <div className="buttons">
                      <div className="main-button">
                        <a href="#courses">Take a look on courses</a>
                      </div>
                      <div className="icon-button"></div>
                    </div>
                  </div>
                </div>
                <div className="item item-2">
                  <div className="header-text">
                    <span className="category">Team</span>
                    <h2>We Have the Best Team with the Best Teachers</h2>
                    <p>
                      Our team consists of highly qualified and experienced
                      teachers who are passionate about education and dedicated
                      to your success. Each instructor brings expertise,
                      innovation, and a student-centered approach to ensure that
                      learning is both engaging and effective.
                    </p>
                    <div className="buttons">
                      <div className="main-button">
                        <a href="#team">Take a Look on our team</a>
                      </div>
                      <div className="icon-button">
                        <a href="#team">
                          <i className="fa fa-play" /> why they are the best?
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item item-3">
                  <div className="header-text">
                    <span className="category">Online Learning</span>
                    <h2>
                      Online Learning Helps You Save Time and Achieve More
                    </h2>
                    <p>
                      Online learning empowers you to balance education with
                      your busy schedule. With flexible courses accessible
                      anytime and anywhere, you can achieve your goals without
                      sacrificing other priorities.
                    </p>
                    <div className="buttons">
                      <div className="main-button">
                        <a href="#services">Take a Look on our services</a>
                      </div>
                      <div className="icon-button">
                        <a href="#services">
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
                  <h4>Online Certificates</h4>
                  <p>
                    Get your online degres from us now and you will not regret
                    it. don't waste time
                  </p>
                  <div className="main-button">
                    <a href="/login">Start Now</a>
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
                  <h4> Live Chat Support</h4>
                  <p>
                    We offer real-time chat support to answer your questions,
                    and assist you with your learning journey.
                  </p>
                  <div className="main-button">
                    <a href="/login">Let's Begin</a>
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
                  <h4>Different Events</h4>
                  <p>
                    we organize a variety of events designed to inspire,
                    educate, and connect our community
                  </p>
                  <div className="main-button">
                    <a href="/login">join us</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section about-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-1">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Where shall we begin?
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                  >
                    <div className="accordion-body">
                      Dolor <strong>almesit amet</strong>, consectetur
                      adipiscing elit, sed doesn't eiusmod tempor incididunt ut
                      labore consectetur <code>adipiscing</code> elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      How do we work together?
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      Dolor <strong>almesit amet</strong>, consectetur
                      adipiscing elit, sed doesn't eiusmod tempor incididunt ut
                      labore consectetur <code>adipiscing</code> elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Quis ipsum suspendisse ultrices gravida.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Why SCHOLAR is the best?
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      There are more than one hundred responsive HTML templates
                      to choose from <strong>Template</strong>Mo website. You
                      can browse by different tags or categories.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      Do we get the best support?
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      You can also search on Google with specific keywords such
                      as{' '}
                      <code>
                        templatemo business templates, templatemo gallery
                        templates, admin dashboard templatemo, 3-column
                        templatemo, etc.
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 align-self-center">
              <div className="section-heading">
                <h6>About Us</h6>
                <h2>What make us the best academy online?</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravid risus commodo.
                </p>
                <div className="main-button">
                  <a href="#">Discover More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section courses" id="courses">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="section-heading">
                <h6>Our Courses</h6>
                <h2>Available Courses</h2>
              </div>
            </div>
          </div>

          {/* Course Categories Filter */}
          <ul className="event_filter">
            <li>
              <a
                className={activeCategory === 'All' ? 'is_active' : ''}
                href="#!"
                onClick={() => setActiveCategory('All')}
              >
                Show All
              </a>
            </li>
            <li>
              <a
                className={activeCategory === 'Data Science' ? 'is_active' : ''}
                href="#!"
                onClick={() => setActiveCategory('Data Science')}
              >
                Data Science
              </a>
            </li>
            <li>
              <a
                className={activeCategory === 'Programming' ? 'is_active' : ''}
                href="#!"
                onClick={() => setActiveCategory('Programming')}
              >
                Programming
              </a>
            </li>
            <li>
              <a
                className={activeCategory === 'English' ? 'is_active' : ''}
                href="#!"
                onClick={() => setActiveCategory('English')}
              >
                English
              </a>
            </li>
          </ul>

          {/* Display filtered courses */}
          <div className="row event_box">
            {filteredCourses.map((course, index) => (
              <div
                key={index}
                className={`col-lg-4 col-md-6 align-self-center mb-30 event_outer`}
              >
                <div className="events_item">
                  <div className="thumb">
                    <a href="#">
                      <img src={course.image} alt={course.name} />
                    </a>
                    <span className="category">{course.category}</span>
                    <span className="price">
                      <h6>
                        <em>$</em>
                        {course.price}
                      </h6>
                    </span>
                  </div>
                  <div className="down-content">
                    <span className="author">{course.intructor_name}</span>
                    <h4>{course.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
                  <img src="/assets/images/Boudy.jpeg" alt="" />
                  <span className="category">Programming intructor</span>
                  <h4>Boudy Marley</h4>
                  <ul className="social-icons">
                    <li>
                      <a
                        href="https://www.facebook.com/profile.php?id=100013617456613"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/abdallahtarek_0/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-member">
                <div className="main-content">
                  <img src="/assets/images/Hoss.jpeg" alt="" />
                  <span className="category">Data Science Instructor</span>
                  <h4>Omar Hossam</h4>
                  <ul className="social-icons">
                    <li>
                      <a
                        href="https://www.facebook.com/omar.hossam.9047/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/_omarhossam__/">
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-member">
                <div className="main-content">
                  <img src="/assets/images/malek.jpeg" alt="" />
                  <span className="category">Programming Instructor</span>
                  <h4>Malek Lukasy</h4>
                  <ul className="social-icons">
                    <li>
                      <a
                        href="https://www.facebook.com/moka.ahmed.1291"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-facebook" />
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://www.instagram.com/malekammar_/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-member">
                <div className="main-content">
                  <img src="/assets/images/Bahaa.jpeg" alt="" />
                  <span className="category">English Instructor</span>
                  <h4>Bahaa Behziouni</h4>
                  <ul className="social-icons">
                    <li>
                      <a
                        href="https://www.facebook.com/ahmed.mohamedbahaa.9"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/bhaa_92/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section testimonials">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="owl-carousel owl-testimonials">
                <div className="item">
                  <p>
                    <strong>
                      "This platform is a gateway to success for students."
                    </strong>
                    It combines expertly curated courses and interactive tools
                    to <strong>equip learners</strong> with essential skills for
                    academic and professional growth. Our mission is to{' '}
                    <strong>empower students</strong> and bridge the gap between
                    education and the real world.
                  </p>
                  <div className="author">
                    <img src="/assets/images/Hoss.jpeg" alt="" />
                    <span className="category">Data Science instructor</span>
                    <h4>Prof.Omar Hossam</h4>
                  </div>
                </div>
                <div className="item">
                  <p>
                    “
                    <strong>
                      Learning to code unlocks endless opportunities.
                    </strong>
                    This platform provides a{' '}
                    <span style={{ fontWeight: 'bold' }}>clear roadmap</span>{' '}
                    for mastering programming concepts, blending hands-on
                    projects with expert guidance. Our goal is to{' '}
                    <strong>nurture creativity</strong> and help students thrive
                    in the tech-driven world.”
                  </p>
                  <div className="author">
                    <img src="/assets/images/boudy.jpeg" alt="" />
                    <span className="category">Programming Instructor</span>
                    <h4>Dr.Boudy Marley</h4>
                  </div>
                </div>
                <div className="item">
                  <p>
                    “
                    <strong>
                      Mastering English empowers students to connect globally.
                    </strong>
                    This platform equips learners with the{' '}
                    <span style={{ fontWeight: 'bold' }}>essential skills</span>{' '}
                    to communicate effectively and confidently in any
                    environment. We focus on building{' '}
                    <strong>fluency and comprehension</strong> to open new
                    opportunities.”
                  </p>
                  <div className="author">
                    <img src="/assets/images/Bahaa.jpeg" alt="" />
                    <span className="category">English Instructor</span>
                    <h4>Dr.Ahmed Behziouni</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 align-self-center">
              <div className="section-heading">
                <h6 className="section-subtitle">STUDENT STORIES</h6>
                <h2 className="section-title">Hear from Our Experts</h2>
                <p className="section-description">
                  Insights and experiences shared by our dedicated instructors
                  to inspire your learning journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section events" id="events">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="section-heading">
                <h6>Schedule</h6>
                <h2>Upcoming Courses</h2>
              </div>
            </div>
            <div className="col-lg-12 col-md-6">
              <div className="item">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="image">
                      <img src="/assets/images/Advanced_ML.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9">
                    <ul>
                      <li>
                        <span className="category">Data Science</span>
                        <h4>Advanced Machnie Learning</h4>
                      </li>
                      <li>
                        <span>Date:</span>
                        <h6>23 December 2024</h6>
                      </li>
                      <li>
                        <span>Duration:</span>
                        <h6>22 Hours</h6>
                      </li>
                      <li>
                        <span>Price:</span>
                        <h6>$120</h6>
                      </li>
                    </ul>
                    <a href="#">
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-6">
              <div className="item">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="image">
                      <img src="/assets/images/german.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9">
                    <ul>
                      <li>
                        <span className="category">Deutsch</span>
                        <h4>German Beginners</h4>
                      </li>
                      <li>
                        <span>Date:</span>
                        <h6>1 Jan 2025</h6>
                      </li>
                      <li>
                        <span>Duration:</span>
                        <h6>30 Hours</h6>
                      </li>
                      <li>
                        <span>Price:</span>
                        <h6>$320</h6>
                      </li>
                    </ul>
                    <a href="#!">
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-6">
              <div className="item">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="image">
                      <img src="/assets/images/Data_Structure.jpg" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9">
                    <ul>
                      <li>
                        <span className="category">Programming</span>
                        <h4>Data structur & Algorithms</h4>
                      </li>
                      <li>
                        <span>Date:</span>
                        <h6>3 Mar 2025</h6>
                      </li>
                      <li>
                        <span>Duration:</span>
                        <h6>48 Hours</h6>
                      </li>
                      <li>
                        <span>Price:</span>
                        <h6>$440</h6>
                      </li>
                    </ul>
                    <a href="#">
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="contact-us section" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-6  align-self-center">
              <div className="section-heading">
                <h6>Contact Us</h6>
                <h2>Feel free to contact us anytime</h2>
                <p>
                  Thank you for choosing our templates. We provide you best CSS
                  templates at absolutely 100% free of charge. You may support
                  us by sharing our website to your friends.
                </p>
                <div className="special-offer">
                  <span className="offer">
                    off
                    <br />
                    <em>50%</em>
                  </span>
                  <h6>
                    Valide: <em>24 April 2036</em>
                  </h6>
                  <h4>
                    Special Offer <em>50%</em> OFF!
                  </h4>
                  <a href="#">
                    <i className="fa fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-us-content">
                <form id="contact-form" action="" method="post">
                  <div className="row">
                    <div className="col-lg-12">
                      <fieldset>
                        <input
                          type="name"
                          name="name"
                          id="name"
                          placeholder="Your Name..."
                          autoComplete="on"
                        />
                      </fieldset>
                    </div>
                    <div className="col-lg-12">
                      <fieldset>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          pattern="[^ @]*@[^ @]*"
                          placeholder="Your E-mail..."
                        />
                      </fieldset>
                    </div>
                    <div className="col-lg-12">
                      <fieldset>
                        <textarea
                          name="message"
                          id="message"
                          placeholder="Your Message"
                          defaultValue={''}
                        />
                      </fieldset>
                    </div>
                    <div className="col-lg-12">
                      <fieldset>
                        <button
                          type="submit"
                          id="form-submit"
                          className="orange-button"
                        >
                          Send Message Now
                        </button>
                      </fieldset>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <footer>
        <div className="container">
          <div className="col-lg-12">
            <p>
              Copyright © intifada Team. All rights reserved.
              &nbsp;&nbsp;&nbsp; Design:{' '}
              <a href="https://templatemo.com" rel="nofollow" target="_blank">
                Omar Hossam
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
