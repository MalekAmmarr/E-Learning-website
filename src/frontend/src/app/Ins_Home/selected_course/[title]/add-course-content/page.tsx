'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './page.css'; // Importing the CSS file

const AddCourseContentPage = () => {
  const [newContent, setNewContent] = useState<string>(''); // Content input
  const [error, setError] = useState<string | null>(null); // Error message
  const [success, setSuccess] = useState<string | null>(null); // Success message
  const [instructorEmail, setInstructorEmail] = useState<string>('');
  const router = useRouter();
  const params = useParams();

  // Decode and validate course title from params
  const courseTitle = Array.isArray(params.title)
    ? params.title[0]
    : params.title;
  if (!courseTitle) {
    throw new Error('Invalid course title');
  }
  const decodedTitle = decodeURIComponent(courseTitle);

  useEffect(() => {
    // Fetch instructor email and access token on component mount
    const accessToken = sessionStorage.getItem('Ins_Token');
    const user = sessionStorage.getItem('instructorData');
    if (user && accessToken) {
      const parsedUser = JSON.parse(user);
      setInstructorEmail(parsedUser.email);
    } else {
      router.push('/Ins_login');
    }
  }, [router]);

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
      const accessToken = sessionStorage.getItem('Ins_Token');
      if (!accessToken) {
        router.push('/Ins_login');
        return;
      }

      if (!instructorEmail) {
        setError('Instructor email is not set.');
        return;
      }

      const response = await fetch(
        `http://localhost:3000/instructor/${encodeURIComponent(instructorEmail)}/addcontent/${encodeURIComponent(decodedTitle)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ newContent: [newContent] }), // Wrap content in an array
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to add course content: ${response.statusText}`);
      }

      setSuccess('Content added successfully!');
      setNewContent(''); // Clear input
      router.refresh();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
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
        <button type="submit" className="submit-btn">
          Add Content
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default AddCourseContentPage;
