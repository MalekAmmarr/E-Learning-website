'use client'; // This marks the component as a client component
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import React from 'react';
import './page.css';

interface Course {
  name: string;
  category: string;
  price: number;
  image: string;
  intructor_name: string;
}
const CourseContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [userData, setUserData] = useState<any>(null);
  const [appliedCourses, setAppliedCourses] = useState<Course[]>([]);
  const [acceptedCourses, setAcceptedCourses] = useState<Course[]>([]);
  const [courseContent, setCourseContent] = useState<string[]>([]);
  const [courseinfo, setCourseInfo] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      name: 'Data Engineering and visualization',
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
  // Method to filter courses based on the title
  const getCourse = (title: string) => {
    return courses.filter((course) => course.name === title);
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

      const response = await fetch('http://localhost:3000/users/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Add token if needed
        },
        body: JSON.stringify({ courseTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course content');
      }

      const data = await response.json();
      setCourseContent(data.content);
      setCourseInfo(getCourse(courseTitle));
      console.log('content : ', data.content); // Assuming the response is an array of strings
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const downloadPDF = async (
    userEmail: String,
    courseTitle: String,
    pdfUrl: String,
  ) => {
    try {
      // Ensure all required parameters are provided
      if (!userEmail || !courseTitle || !pdfUrl) {
        console.error('Missing required parameters');
        return;
      }

      // Create the request body with the three parameters
      const body = {
        userEmail: userEmail,
        Coursetitle: courseTitle,
        pdfUrl: pdfUrl,
      };

      // Make the API request to download PDF
      const response = await fetch('http://localhost:3000/users/download-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include token if required
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF download link');
      }

      const data = await response.json();

      // Check for the download link in the response
      if (data.downloadLink) {
        const downloadLink = data.downloadLink;
        window.open(downloadLink, '_blank'); // Open the PDF in a new window
      } else {
        console.error('Download link not found in the response');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    const accessToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    if (user) {
      if (accessToken) {
        const parsedUser = JSON.parse(user);
        fetchUserDetails(parsedUser.email, accessToken);
      } // Set userData state only if data exists}
    } else {
      router.push('/login');
    }
    fetchContent();
  }, []);
  // Method to fetch user details from the API
  const fetchUserDetails = async (email: string, accessToken: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/getUser/${email}`,
        {
          method: 'Post',
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

  // Function to handle note title click
  const HandleStartExam = async (
    quizId: string,
    quizType: string,
    numberOfQuestions: number,
  ) => {
    const queryParams = new URLSearchParams(window.location.search);
    const courseTitle = queryParams.get('title'); // Get 'title' from query params
    const studentEmail = userData.email;
    try {
      // Step 1: Get the student's progress from the backend using fetch
      const response = await fetch(
        `http://localhost:3000/progress/getProgress/${courseTitle}/${studentEmail}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching progress data');
      }

      const score = data.score; // Assuming the score is in the response
      // Step 3: Create quiz by calling the backend API
      const quizResponse = await fetch('http://localhost:3000/quizzes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructorEmail: 'omar.hossam3@gmail.com', // Replace with the actual instructor's email
          quizId: quizId, // Dynamic quiz ID based on course title
          quizType: quizType, // Set based on score
          numberOfQuestions: numberOfQuestions, // Example number of questions
          studentEmail: studentEmail, // Student email
          courseTitle: courseTitle, // Course title
        }),
      });

      const quizData = await quizResponse.json();

      if (!quizResponse.ok) {
        setError(quizData.message);
        throw new Error(quizData.message || 'Error creating quiz');
      }

      // Step 4: Handle the successful quiz creation (e.g., redirect to the quiz page)
      console.log('Quiz : ', quizData);
      console.log('Quiz_Id :', quizData.data.quiz_id);
      if (courseTitle)
        window.location.href = `/User_Home/CourseContent/Quiz?title=${encodeURIComponent(courseTitle)}&quiz_id=${quizData.data.quiz_id}`;
      else throw new Error('Course Not Found');
    } catch (error) {
      //console.error('An error occurred:', error);
      //alert(`An error occurred while processing your request: ${error}`);
    }
  };
  const HandleStartMid = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const courseTitle = queryParams.get('title'); // Get 'title' from query params
    const studentEmail = userData.email;
    try {
      // Step 1: Get the student's progress from the backend using fetch
      const response = await fetch(
        `http://localhost:3000/progress/getProgress/${courseTitle}/${studentEmail}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching progress data');
      }

      const score = data.score; // Assuming the score is in the response
      // Step 3: Create quiz by calling the backend API
      const quizResponse = await fetch('http://localhost:3000/quizzes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructorEmail: 'omar.hossam3@gmail.com', // Replace with the actual instructor's email
          quizId: `midterm`, // Dynamic quiz ID based on course title
          quizType: 'Midterm', // Set based on score
          numberOfQuestions: 15, // Example number of questions
          studentEmail: studentEmail, // Student email
          courseTitle: courseTitle, // Course title
        }),
      });

      const quizData = await quizResponse.json();

      if (!quizResponse.ok) {
        throw new Error(quizData.message || 'Error creating quiz');
      }

      // Step 4: Handle the successful quiz creation (e.g., redirect to the quiz page)
      console.log('Quiz : ', quizData);
      console.log('Quiz_Id :', quizData.data.quiz_id);
      if (courseTitle)
        window.location.href = `/User_Home/CourseContent/Quiz?title=${encodeURIComponent(courseTitle)}&quiz_id=${quizData.data.quiz_id}`;
      else throw new Error('Course Not Found');
    } catch (error) {
      console.error('An error occurred:', error);
      //alert(`An error occurred while processing your request: ${error}`);
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
                    <a href="#events">Events</a>
                  </li>
                  <li>
                    <Link href="/User_Home/Notification">
                      <i className="fas fa-bell"></i>{' '}
                      {/* This is the notification bell icon */}
                    </Link>
                  </li>
                  <li>
                    <Link href="/User_Home/Profile">
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
                  <img src="/assets/images/Quiz.jpg" alt="online degrees" />
                </div>

                <div className="main-content">
                  <h4>Quiz</h4>
                  <p>Start your quiz that will show us your level</p>

                  {/* Error message */}
                  <div className="main-button">
                    <a onClick={() => HandleStartExam('quiz01', 'Small', 10)}>
                      Start Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {userData && userData.HaveEnteredQuiz && (
              <div className="col-lg-4 col-md-6">
                <div className="service-item">
                  <div className="circle-image">
                    <img
                      src="/assets/images/midterm.jpg"
                      alt="online degrees"
                    />
                  </div>
                  <div className="main-content">
                    <h4>Midterm</h4>
                    <p>
                      The midterm exam tests your understanding of the first
                      half of the course. Make sure to review key topics and
                      practice in preparation.
                    </p>
                    <div className="main-button">
                      <a
                        onClick={() =>
                          HandleStartExam('midterm', 'Midterm', 15)
                        }
                      >
                        Start Midterm
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {userData && userData.HaveEnteredMid && (
              <div className="col-lg-4 col-md-6">
                <div className="service-item">
                  <div className="circle-image">
                    <img src="/assets/images/final.jpg" alt="online degrees" />
                  </div>
                  <div className="main-content">
                    <h4>Final</h4>
                    <p>
                      The final exam will cover all course material. Be sure to
                      review everything to perform your best.
                    </p>
                    <div className="main-button">
                      <a href="#">Start Final</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
            {courseContent.length > 0 ? (
              courseContent.map((course, index) => (
                <div
                  key={index}
                  className="col-lg-4 col-md-6 align-self-center mb-30 event_outer"
                >
                  <div className="events_item">
                    {/* Course Image and Category */}
                    <div className="thumb">
                      <a
                        onClick={() =>
                          downloadPDF(
                            userData?.email,
                            courseinfo[0].name,
                            course,
                          )
                        }
                      >
                        <img
                          src={courseinfo[0].image} // Correct usage of the current course image
                          alt={courseinfo[0].name} // Correct usage of the current course name
                        />
                      </a>
                      <span className="category">{courseinfo[0].category}</span>
                    </div>

                    {/* Course Instructor and Title */}
                    <div className="down-content">
                      <span className="author">
                        {courseinfo[0].intructor_name}
                      </span>
                      <h4
                        onClick={() =>
                          downloadPDF(
                            userData?.email,
                            courseinfo[0].name,
                            course,
                          )
                        }
                      >
                        {course}
                      </h4>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="waiting-message">
                  Your application is awaiting instructor acceptance.
                </p>
              </div>
            )}
          </div>
        </div>
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
