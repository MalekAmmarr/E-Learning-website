'use client'; // This marks the component as a client component
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import './page.css';
import { Spinner } from 'react-bootstrap';

interface Course {
  courseId: string;
  title: string;
  instructormail: string;
  instructorName?: string;
  description: string;
  category: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  isArchived: boolean;
  totalClasses: number;
  courseContent: string[]; // Array of PDF URLs/paths
  notes: string[]; // Array of note IDs or content (you can adjust depending on the structure of the notes)
  price: number;
  image: string; // URL or path to the course image
}
const CourseContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [userData, setUserData] = useState<any>(null);
  const [appliedCourses, setAppliedCourses] = useState<Course[]>([]);
  const [acceptedCourses, setAcceptedCourses] = useState<Course[]>([]);
  const [courseContent, setCourseContent] = useState<string[]>([]);
  const [courseinfo, setCourseInfo] = useState<Course>();
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  if (!title) {
    throw new Error('Invalid course title');
  }

  const courseTitle = decodeURIComponent(title);

  const getCourse = async (tittle: string): Promise<Course> => {
    const response = await fetch(
      `http://localhost:3000/courses/CoursesTitle/${tittle}`,
      {
        method: 'GET',
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch user details:`);
    }
    return response.json();
  };
  const fetchCourses = async (): Promise<Course[]> => {
    try {
      setIsLoading(true);
      const accessToken = sessionStorage.getItem('Ins_Token'); 
      const response = await fetch(`http://localhost:3000/instructor/course/bytitle?title=${encodeURIComponent(courseTitle)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add the token to the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const course = await response.json();
      console.log('Fetched courses details:', course); // Debugging: Log the fetched user details
      setCourse(course);
      return course; // Update state with user data
    } catch (error) {
      console.error('Error fetching user details', error);
      throw error; // Propagate the error for the caller to handle
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams(window.location.search);
      const courseTitle = queryParams.get('title'); // Get 'title' from query params

      if (!courseTitle) {
        console.error('courseTitle not provided in URL');
        return;
      }

      const response = await fetch('http://localhost:3000/instructor/inscontent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('Ins_Token')}`, // Add token if needed
        },
        body: JSON.stringify({ courseTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course content');
      }

      const data = await response.json();
      setCourseContent(data.content);
      const course = await getCourse(courseTitle);
      console.log('Course : ', course);
      setCourseInfo(course);
      console.log('content : ', data.content); // Assuming the response is an array of strings
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    fetchCourses();
    const accessToken = sessionStorage.getItem('Ins_token');
    const user = sessionStorage.getItem('instructorData');
    if (user) {
      if (accessToken) {
        const parsedUser = JSON.parse(user);
        fetchUserDetails(parsedUser.email, accessToken);
      } // Set userData state only if data exists}
    } else {
      router.push('/Ins_login');
    }
    fetchContent();
  }, []);
  // Method to fetch user details from the API
  const fetchUserDetails = async (email: string, accessToken: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/instructor/${email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Assuming Bearer token is used for authorization
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched user details:', data); // Debugging: Log the fetched user details
      setUserData(data); // Update state with user data
    } catch (error) {
      console.error('Error fetching user details');
    }
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
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      <title>Instructor:{userData?.name}</title>
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
                  <li className="scroll-to-section">
                    <a href="#events">Events</a>
                  </li>
                  <li>
                    <Link href="/Ins_Home/Profile">
                      {userData?.profilePictureUrl ? (
                        <img
                          src={userData.profilePictureUrl}
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
              <div className="owl-carousel owl-banner"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="services section" id="services">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="service-item">
                <div className="circle-image">
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className="error">
              <div className="error__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  viewBox="0 0 24 24"
                  height={24}
                  fill="none"
                >
                  <path
                    fill="#393a37"
                    d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"
                  />
                </svg>
              </div>
              <div className="error__title">{error}</div>
              <div className="error__close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  viewBox="0 0 20 20"
                  height={20}
                >
                  <path
                    fill="#393a37"
                    d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ***** Header Area End ***** */}

      <div className="section courses" id="courses">
        <div className="container">
          {/* Section Header */}
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="section-heading">
                <h6>Your Course</h6>
                <h2>Course Content</h2>
              </div>
            </div>
          </div>

          {/* Display filtered courses or message */}
          <div className="row event_box">
            {courseinfo && courseContent.length > 0 ? (
              courseContent.map((course, index) => (
                <div
                  key={index}
                  className="col-lg-4 col-md-6 align-self-center mb-30 event_outer"
                >
                  <div className="events_item">
                    {/* Course Image and Category */}
                    <div className="thumb">
                      <a
                      >
                        <img
                          src={courseinfo.image} // Correct usage of the current course image
                          alt={courseinfo.title} // Correct usage of the current course name
                        />
                      </a>
                      <span className="category">{courseinfo.category}</span>
                    </div>

                    {/* Course Instructor and Title */}
                    <div className="down-content">
                      <span className="author">
                        {courseinfo.instructorName}
                      </span>
                      <h4
                      >
                        {isLoading ? (
                          <div className="loading-overlay">
                            <div className="loading-content">
                              <div className="loading-spinner"></div>
                              <p>Downloading...</p>
                            </div>
                          </div>
                        ) : (
                          course.split('.')[0]
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="loading-overlay">
                <div className="loading-content">
                  <Spinner animation="border" variant="primary" />
                  <p>Loading content, please wait...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <Link
          href={`/Ins_Home/selected_course/${encodeURIComponent(courseTitle)}/add-course-content`}
        >
          <button className="action-button add-button">Add Content</button>
        </Link>
        <Link
          href={`/Ins_Home/selected_course/${courseTitle}/delete-course-content`}
        >
          <button className="action-button update-button">
            Delete Content
          </button>
        </Link>
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
};
export default CourseContent;
