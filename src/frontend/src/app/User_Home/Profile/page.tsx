'use client';
import { useState, useEffect } from 'react';
import React from 'react';
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

const Profile = () => {
  const [user, setUser] = useState<User | null>(null); // Single user object
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
  const handleDelete = async (email: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admins/students/deleteByEmail/${email}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete student. Status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error deleting student:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="card">
      {/* Profile Image */}
      <div
        className="img"
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundImage: user.profilePictureUrl
            ? `url(${user.profilePictureUrl})`
            : `url(/assets/images/Default.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px', // Added margin for spacing
        }}
      ></div>

      {/* Profile Info */}
      <div className="info" style={{ marginBottom: '20px' }}>
        <span className="name" style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {user.name}
        </span>
        <p className="job" style={{ fontStyle: 'italic' }}>
          {`Email: ${user.email}`}
        </p>
        <p>{`Age: ${user.age}`}</p>
        <p>{`GPA: ${user.GPA.toFixed(2)}`}</p>
      </div>

      {/* Applied and Accepted Courses */}
      <div className="courses" style={{ marginBottom: '20px' }}>
        <h3>Applied Courses</h3>
        <ul>
          {user.appliedCourses.length > 0 ? (
            user.appliedCourses.map((course, index) => (
              <li key={index}>{course}</li>
            ))
          ) : (
            <li>No applied courses</li>
          )}
        </ul>
        <h3>Accepted Courses</h3>
        <ul>
          {user.acceptedCourses.length > 0 ? (
            user.acceptedCourses.map((course, index) => (
              <li key={index}>{course}</li>
            ))
          ) : (
            <li>No accepted courses</li>
          )}
        </ul>
      </div>

      {/* Course Scores */}
      <div className="courses" style={{ marginBottom: '20px' }}>
        <h3>Course Scores</h3>
        <ul>
          {user.courseScores.length > 0 ? (
            user.courseScores.map((score, index) => (
              <li key={index}>
                {score.courseTitle}: {score.score}
              </li>
            ))
          ) : (
            <li>No course scores available</li>
          )}
        </ul>
      </div>

      {/* Buttons */}
      <div
        className="button-container"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <a
          href="/User_Home"
          className="button"
          style={{ flex: 1, marginRight: '10px' }}
        >
          Return Home
        </a>
        <a
          href="/User_Home/Profile/EditProfile"
          className="button edit-button"
          style={{ flex: 1, marginRight: '10px' }}
        >
          Edit Profile
        </a>
        <a
          href="/login"
          className="button delete-button"
          onClick={() => handleDelete(user?.email)}
          style={{ flex: 1 }}
        >
          Delete Account
        </a>
      </div>
    </div>
  );
};

export default Profile;
