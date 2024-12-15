'use client';
import { useEffect, useState } from 'react';
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

const CourseDetailsPage = () => {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();

  if (!params.title || Array.isArray(params.title)) {
    throw new Error('Invalid course title');
  }

  const courseTitle = decodeURIComponent(params.title);

  useEffect(() => {
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
  }, [courseTitle]);

  const handleAddContentClick = () => {
    router.push(`/Ins_Home/Add_content/course/${encodeURIComponent(courseTitle)}/add-course-content`);
  };

  const handleUpdateContentClick = () => {
    router.push(`/Ins_Home/Add_content/course/${courseTitle}/update-course-content/${courseTitle}`);
  };

  const handleEditContentClick = () => {
    router.push(`/Ins_Home/Add_content/course/${courseTitle}/edit-course-content`);
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
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
            <li key={index}>{content}</li>
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
        <button className="action-button add-button" onClick={handleAddContentClick}>
          Add Content
        </button>
        <button className="action-button update-button" onClick={handleUpdateContentClick}>
          Update Content
        </button>
        <button className="action-button edit-button" onClick={handleEditContentClick}>
          Edit Content
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
