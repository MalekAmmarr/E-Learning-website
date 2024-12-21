'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

export interface User {
  email: string;
  name: string;
  age: string;
  passwordHash: string;
  profilePictureUrl?: string;
  appliedCourses: string[];
  acceptedCourses: string[];
  courseScores: { courseTitle: string; score: number }[];
  Notifiction: string[];
  feedback: Array<{
    quizId: string;
    courseTitle: string;
    feedback: Array<{ question: string; feedback: string }>;
  }>;
  Notes: string[];
  GPA: number;
}

const AddNotes: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [Title, setTitle] = useState('');

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fetchUserDetails = async (
    email: string,
    accessToken: string,
  ): Promise<User> => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/getUser/${email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Assuming Bearer token is used for authorization
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const data: User = await response.json();
      console.log('Fetched user details:', data); // Debugging: Log the fetched user details
      setUser(data); // Update state with user data
      return data; // Return the fetched user data
    } catch (error) {
      console.error('Error fetching user details', error);
      throw error; // Propagate the error for the caller to handle
    }
  };

  useEffect(() => {
    try {
      const userData = sessionStorage.getItem('userData');
      const accessToken = sessionStorage.getItem('authToken');
      if (userData) {
        if (accessToken) {
          const parsedData: User = JSON.parse(userData); // Parse the single user object
          fetchUserDetails(parsedData.email, accessToken);
        } else router.push('/login');
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(
        'Failed to retrieve or parse user data from localStorage',
        err,
      );
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission (page reload)

    // Clear previous error
    setError(null);

    try {
      const formData = new FormData();
      formData.append('studentEmail', user?.email ? user.email : 'Nothing');
      formData.append('Title', Title);

      // Make the API request to your NestJS backend
      const response = await fetch('http://localhost:3000/note/createNote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`, // Add the Bearer token
        },
        body: JSON.stringify({
          studentEmail: user?.email ? user.email : 'Nothing',
          Title,
        }),
      });

      if (response.ok) {
        // If the submission is successful, redirect to the notes page
        router.push('/User_Home/Notes');
      } else {
        // Handle failure response
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add note');
      }
    } catch (err) {
      console.error('Request failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <div className="container">
        <div className="heading">Add New Note</div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              required
              autoComplete="off"
              type="text"
              name="Title"
              id="title"
              value={Title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="title">Note Title</label>
          </div>

          {error && <div className="error-message">{error}</div>}
          <div className="btn-container">
            <button className="btn">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNotes;
