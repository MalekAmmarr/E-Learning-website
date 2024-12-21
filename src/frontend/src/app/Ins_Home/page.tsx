'use client'; // This marks the component as a client component
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import React from 'react';

export interface Instructor {
  _id: string;
  email: string;
  name: string;
  age: string; // Assuming age is a string, but can be converted to number if necessary
  passwordHash: string;
  Teach_Courses: string[]; // List of course names the instructor teaches
  profilePictureUrl?: string;
  Certificates: string; // Certificates the instructor holds
  createdAt: string; // ISO Date format
  updatedAt: string; // ISO Date format
  __v: number; // MongoDB version field (not typically required in app logic)
}

interface Course {
  title: string;
  category: string;
  price: number;
  image: string;
  instructor_name: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [insdata, setInsData] = useState<any>(null);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [Teach_Courses, setTeachCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Retrieve the access token and instructor data from session storage
        const accessToken = sessionStorage.getItem('Ins_Token'); // Updated to match token naming convention
        const storedInstructor = sessionStorage.getItem('instructorData'); // Updated to match instructor data storage key
        console.log('Access Token:', accessToken);
        
        if (storedInstructor && accessToken) {
          const parsedInstructor = JSON.parse(storedInstructor);
          setInsData(parsedInstructor);

          console.log('Access Token:', accessToken);
          console.log('Instructor Email:', parsedInstructor?.email);

  
          // Fetch courses for the instructor using the email
          const response = await fetch(
            `http://localhost:3000/instructor/courses?email=${parsedInstructor?.email}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`, // Add the token to the Authorization header
                'Content-Type': 'application/json',
              },
            }
          );
  
          if (response.ok) {
            const data = await response.json(); // Parse the response body only once
            console.log('API Response:', data); // Log the parsed response
            setTeachCourses(data); // Set the fetched courses into the state
          } else {
            const errorText = await response.text(); // Log the error body (not JSON parsing again)
            console.error('Failed to fetch courses:', errorText);
          }
        } else {
          // Redirect to login if instructor data or token is missing
          router.push('/Ins_login');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
  
    fetchCourses(); // Call the fetchCourses function
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const filteredAcceptedCourses =
    activeCategory === 'All'
      ? Teach_Courses
      : Teach_Courses.filter(
          (Teach_Courses) => Teach_Courses.category === activeCategory,
        );

  const handleCourseTitleClick = (title: string) => {
    router.push(
      `/Ins_Home/selected_course?title=${encodeURIComponent(title)}`,
    );
  };


  const handleCreateCourse = () => {
    router.push('/Ins_Home/create-course');
  };

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
                  <Link href="/Ins_Home/Profile">
                      {insdata?.profilePictureUrl ? (
                        <img
                          src={`http://localhost:3000/files/${insdata.profilePictureUrl}`}
                          alt="Profile"
                          style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <img
                          src={'/assets/images/Default.jpg'}
                          alt="Profile"
                          style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                    </Link>
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
                  <h4>Give Certificates</h4>
                  <p>You can give Certificates for the students with their final grade from here</p>
                  <div className="main-button">
                    <a href="/Ins_Home/Certificates">Add</a>
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
                  <h4>Students feedbacks</h4>
                  <p>You can give feedbacks for Quizes and Exams from Here.</p>
                  <div className="main-button">
                    <a href="/Ins_Home/Put_grades">Give feedbacks</a>
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

          {/*wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww*/}
        </div>
      </section>
      {/* Display filtered courses or message */}
      <div className="main-content">
      <section className="section courses" id="courses">
  <div className="container">
    {/* Course Categories Filter */}
    <ul className="event_filter">
      {filteredAcceptedCourses.map((course) => (
        <li key={course.title} onClick={() => handleCourseTitleClick(course.title)}>
          <div className="course-card">
            <Image src={course.image} alt={course.title} width={300} height={200} />
            <h3>{course.title}</h3>
            <p>Instructor: {course.instructor_name}</p>
            <p>Price: ${course.price}</p>
            <p>Category: {course.category}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>
<div className="row">
          <div className="col-lg-12 text-center">
            <button className="btn btn-primary" onClick={handleCreateCourse}>
              Create Course
            </button>
          </div>
        </div>



  <footer className="footer-spacing">
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
</div>


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
