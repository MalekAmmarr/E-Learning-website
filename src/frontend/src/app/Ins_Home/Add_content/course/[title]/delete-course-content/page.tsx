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
};

const DeleteCourseContentPage = () => {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instructorEmail, setInstructorEmail] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();

  if (!params.title || Array.isArray(params.title)) {
    throw new Error('Invalid course title');
  }

  const courseTitle = decodeURIComponent(params.title);

  useEffect(() => {
    // Retrieve instructor email from localStorage
    const storedInstructor = localStorage.getItem('instructorData');
    if (storedInstructor) {
      const parsedInstructor = JSON.parse(storedInstructor);
      setInstructorEmail(parsedInstructor.email);
    } else {
      setError('Instructor data not found. Please log in again.');
    }
  }, []);

  useEffect(() => {
    if (!instructorEmail) return;

    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/instructor/course?title=${encodeURIComponent(courseTitle)}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch course details: ${res.statusText}`);
        }
        const data = await res.json();
        setCourse(data);
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

    try {
      if (!instructorEmail) {
        throw new Error('Instructor email not found. Please log in again.');
      }

      const res = await fetch(
        `http://localhost:3000/instructor/${encodeURIComponent(instructorEmail)}/courses/${encodeURIComponent(courseTitle)}/deletecontent`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contentToDelete: selectedContent }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete course content: ${res.statusText}`);
      }

      // Refresh the page or redirect to course details after deletion
      router.push(`/Ins_Home/Add_content/course/${encodeURIComponent(courseTitle)}`);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
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
      <div className="course-content">
        <h3>Current Course Content</h3>
        <form>
          {course?.courseContent.map((content, index) => (
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
      </div>
      <div className="action-buttons-container">
        <button className="action-button delete-button" onClick={handleDeleteContentClick}>
          Delete Selected Content
        </button>
      </div>
    </div>
  );
};

export default DeleteCourseContentPage;
