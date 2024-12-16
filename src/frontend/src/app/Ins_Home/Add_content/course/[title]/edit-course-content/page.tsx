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

const EditCourseContentPage = () => {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [newContent, setNewContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instructorEmail, setInstructorEmail] = useState<string>('');

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

  useEffect(() => {
    // Automatically set the instructor email from localStorage
    const storedInstructor = localStorage.getItem('instructorData');
    if (storedInstructor) {
      const { email } = JSON.parse(storedInstructor);
      setInstructorEmail(email); // Store the email for later use
    }
  }, []);

  const handleSaveContentClick = async () => {
    if (!newContent.trim()) {
      setError('Content cannot be empty');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/instructor/${encodeURIComponent(instructorEmail)}/courses/${encodeURIComponent(courseTitle)}/editcontent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newContent: [newContent] }), // Wrap the new content in an array
      });

      if (!res.ok) {
        throw new Error(`Failed to update course content: ${res.statusText}`);
      }

      // Redirect back to course details page after saving
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
    <div className="edit-course-content-container">
      <h1 className="course-title">Edit Content for {course?.title}</h1>
      <div className="course-content">
        <h3>Current Course Content</h3>
        <ul>
          {course?.courseContent.map((content, index) => (
            <li key={index}>{content}</li>
          ))}
        </ul>
      </div>
      <div className="new-content">
        <h3>Add New Content</h3>
        <textarea
          className="content-textarea"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Enter new content here..."
        />
      </div>
      <div className="action-buttons-container">
        <button className="action-button save-button" onClick={handleSaveContentClick}>
          Save Content
        </button>
      </div>
    </div>
  );
};

export default EditCourseContentPage;