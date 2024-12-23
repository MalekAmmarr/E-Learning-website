'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './page.css'; // Importing the CSS file

type CourseDetails = {
  title: string;
  description: string;
  instructorName?: string;
  category: string;
  difficultyLevel: string;
  totalClasses: number;
  courseContent: string[];
  notes: string[];
  image: string;
};

const DeleteCourseContentPage = () => {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instructorEmail, setInstructorEmail] = useState<string | null>(null);
  const [courseContent, setCourseContent] = useState<string[]>([]); // Store course content separately

  const router = useRouter();
  const params = useParams();

  if (!params.title || Array.isArray(params.title)) {
    throw new Error('Invalid course title');
  }

  const courseTitle = decodeURIComponent(params.title);

  useEffect(() => {
    // Retrieve instructor email from sessionStorage
    const accessToken = sessionStorage.getItem('Ins_Token');
    const storedInstructor = sessionStorage.getItem('instructorData');
    if (storedInstructor && accessToken) {
      const parsedInstructor = JSON.parse(storedInstructor);
      setInstructorEmail(parsedInstructor.email);
    } else {
      setError('Instructor data not found. Please log in again.');
    }
  }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const accessToken = sessionStorage.getItem('Ins_Token');
      if (!accessToken) {
        router.push('/Ins_login');
        return;
      }
        
        const res = await fetch(
          `http://localhost:3000/instructor/course/bytitle?title=${encodeURIComponent(courseTitle)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`, // Add the token to the Authorization header
              'Content-Type': 'application/json',
            },
          },
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch course details: ${res.statusText}`);
        }
        const data = await res.json();
        setCourse(data.course);
        setCourseContent(data.course.courseContent || []); // Ensure courseContent is always an array
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseTitle, instructorEmail]);

  const handleCheckboxChange = (content: string) => {
    setSelectedContent((prev) =>
      prev.includes(content) ? prev.filter((item) => item !== content) : [...prev, content]
    );
  };

  const handleDeleteContentClick = async () => {
    if (selectedContent.length === 0) {
      setError('Please select at least one content item to delete.');
      return;
    }

    if (!instructorEmail) {
      setError('Instructor email is not available.');
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('Ins_Token');
      if (!accessToken) {
        router.push('/Ins_login');
        return;
      }
      const res = await fetch(
        `http://localhost:3000/instructor/${encodeURIComponent(
          instructorEmail
        )}/courses/${encodeURIComponent(courseTitle)}/deletecontent`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ contentToDelete: selectedContent }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete course content: ${res.statusText}`);
      }

      const updatedCourse = await res.json();
      setCourse(updatedCourse);
      setSelectedContent([]); // Clear the selected content after successful deletion
      setError(null); // Clear any previous error messages
      setTimeout(() => {
        router.push(`/Ins_Home/selected_course?title=${encodeURIComponent(courseTitle)}`);
      }, 150);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="delete-course-content-container">
      <h1 className="course-title">Delete Content from {course?.title}</h1>
      {courseContent.length > 0 ? (
        <form>
          <h2>Current Course Content</h2>
          {courseContent.map((content, index) => (
            <div key={index} className="content-item">
              <input
                type="checkbox"
                id={`content-${index}`}
                value={content}
                onChange={() => handleCheckboxChange(content)}
              />
              <label htmlFor={`content-${index}`}>{content}</label>
            </div>
          ))}
        </form>
      ) : (
        <>
          <h2>Current Course Content</h2>
          <p>No course content available.</p>
          <div>
            <h3>Debugging Course Content</h3>
            <pre>{JSON.stringify(course, null, 2)}</pre>
          </div>
        </>
      )}
      <div className="action-buttons-container">
        <button className="action-button delete-button" onClick={handleDeleteContentClick}>
          Delete Selected Content
        </button>
      </div>
    </div>
  );
};

export default DeleteCourseContentPage;
