'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './page.css'; // Importing the CSS file

const AddCourseContentPage = () => {
  const [newContent, setNewContent] = useState<string>(''); // Content input
  const [error, setError] = useState<string | null>(null); // Error message
  const [success, setSuccess] = useState<string | null>(null); // Success message
  const router = useRouter();
  const params = useParams();
  const [instructorEmail, setInstructorEmail] = useState<string>('');

  // Decode and validate course title from params
  const courseTitle = Array.isArray(params.title) ? params.title[0] : params.title;
  if (!courseTitle) {
    throw new Error('Invalid course title');
  }
  const decodedTitle = decodeURIComponent(courseTitle);

  useEffect(() => {
    // Automatically set the instructor email from localStorage
    const storedInstructor = localStorage.getItem('instructorData');
    if (storedInstructor) {
      const { email } = JSON.parse(storedInstructor);
      setInstructorEmail(email); // Store the email for later use
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newContent.trim()) {
      setError('Content cannot be empty.');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `http://localhost:3000/instructor/${encodeURIComponent(instructorEmail)}/addcontent/${encodeURIComponent(decodedTitle)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newContent: [newContent] }), // Wrap content in an array
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add course content: ${response.statusText}`);
      }

      setSuccess('Content added successfully!');
      setNewContent(''); // Clear input

      // Redirect after successful submission
      setTimeout(() => {
        router.push(`/Ins_Home/Add_Content/course/${encodeURIComponent(decodedTitle)}`);
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Course Content</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="newContent" className="label">
          New Content:
          <input
            id="newContent"
            type="text"
            value={newContent}
            onChange={handleContentChange}
            placeholder="Enter new content"
            className="input"
          />
        </label>
        <button type="submit" className="submit-btn">Add Content</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default AddCourseContentPage;