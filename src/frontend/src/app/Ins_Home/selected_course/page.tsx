'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; // Import Link from next/link
import './page.css'; // Importing the CSS file

type CourseDetails = {
  title: string;
  description: string;
  instructorName?: string;
  category: string;
  difficultyLevel: string;
  totalClasses: number;
  courseContent: string[]; // Array of PDF URLs/paths
  image: string; // URL or path to the course image
  notes: string[];
};

const CourseDetailsPage = () => {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  if (!title) {
    throw new Error('Invalid course title');
  }

  const courseTitle = decodeURIComponent(title);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/instructor/course?title=${encodeURIComponent(courseTitle)}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch course details: ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Fetched course data:', data); // Log the data for debugging
        setCourse(data.course); // Assuming the data is nested under 'course'
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseTitle]);

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!course) {
    return <div className="error">No course data available</div>;
  }

  return (
    <div className="course-details-container">
      <h1 className="course-title">{course?.title}</h1>
      <div className="course-meta">
        <p><strong>Instructor:</strong> {course?.instructorName || 'Unknown'}</p>
        <p><strong>Category:</strong> {course?.category}</p>
        <p><strong>Difficulty Level:</strong> {course?.difficultyLevel}</p>
        <p><strong>Total Classes:</strong> {course?.totalClasses}</p>
      </div>
      <div className="course-description">
        <h3>Description</h3>
        <p>{course?.description}</p>
      </div>
      <div className="course-content">
        <h3>Course Content</h3>
        <ul>
          {course?.courseContent.map((content, index) => (
            <li key={index} className="course-content-item">
              {/* Display course image above each lecture */}
              <div className="course-image-container">
                <img src={course?.image} alt={`Lecture ${index + 1}`} className="course-image" />
              </div>
              <a href={content} target="_blank" rel="noopener noreferrer">
                <button className="pdf-button">View PDF {index + 1}</button>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="course-notes">
        <h3>Notes</h3>
        <ul>
          {course?.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
      <div className="action-buttons-container">
        <Link href={`/Ins_Home/selected_course/${encodeURIComponent(courseTitle)}/add-course-content`}>
          <button className="action-button add-button">
            Add Content
          </button>
        </Link>
        <Link href={`/Ins_Home/selected_course/${courseTitle}/delete-course-content`}>
          <button className="action-button update-button">
            Delete Content
          </button>
        </Link>
        <Link href={`/Ins_Home/selected_course/${courseTitle}/edit-course-content`}>
          <button className="action-button edit-button">
            Edit Content
          </button>
        </Link>
        <Link href={`/Ins_Home/selected-course/${encodeURIComponent(courseTitle)}/QuizzesPage`}>
          <button className="action-button quizzes-button">
            View Quizzes
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
