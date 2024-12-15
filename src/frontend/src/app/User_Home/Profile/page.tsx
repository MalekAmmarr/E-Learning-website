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

  useEffect(() => {
    try {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        const parsedData: User = JSON.parse(userData); // Parse the single user object
        setUser(parsedData);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(
        'Failed to retrieve or parse user data from sessionStorage',
        err,
      );
      router.push('/login');
    }
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="card">
      {/* Profile Image */}
      <div
        className="img"
        style={{
          width: '150px', // Set the width of the circle
          height: '150px', // Set the height of the circle
          borderRadius: '50%', // Make it circular
          backgroundImage: user.profilePictureUrl
            ? `url(${user.profilePictureUrl})`
            : `url(/assets/images/Hoss.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center', // Center the image vertically
          justifyContent: 'center', // Center the image horizontally
        }}
      ></div>

      {/* Profile Info */}
      <div className="info">
        <span className="name">{user.name}</span>
        <p className="job">{`Email: ${user.email}`}</p>
        <p>{`Age: ${user.age}`}</p>
        <p>{`GPA: ${user.GPA.toFixed(2)}`}</p>
      </div>

      {/* Applied and Accepted Courses */}
      <div className="courses">
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
      <div className="courses">
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

      {/* Button */}
      <a href="/User_Home" className="button">
        Return Home
      </a>
    </div>
  );
};

export default Profile;
