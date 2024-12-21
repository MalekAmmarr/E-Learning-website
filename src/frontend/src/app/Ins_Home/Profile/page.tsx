'use client';
import { useState, useEffect } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';

import './page.css';

export interface Instructor {
  email: string;
  name: string;
  age: string; // Assuming age is a string, but can be converted to number if necessary
  passwordHash: string;
  Teach_Courses: string[]; // List of course names the instructor teaches
  profilePictureUrl?: string;
  Certificates: string; // Certificates the instructor holds
  createdAt: string; // ISO Date format
  updatedAt: string; // ISO Date format
  __v: number; // MongoDB version field (not typically required in app logic)
}

const Profile = () => {
  const [instructor, setUser] = useState<Instructor | null>(null); // Single user object
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem('instructorData');
      if (userData) {
        const parsedData: Instructor = JSON.parse(userData); // Parse the single user object
        setUser(parsedData);
      } else {
        router.push('/Ins_login');
      }
    } catch (err) {
      console.error(
        'Failed to retrieve or parse user data from localStorage',
        err,
      );
      router.push('/login');
    }
  }, [router]);

  if (!instructor) return <div>Loading...</div>;

  return (
    <div className="card">
      {/* Profile Image */}
      <div
        className="img"
        style={{
          width: '150px', // Set the width of the circle
          height: '150px', // Set the height of the circle
          borderRadius: '50%', // Make it circular
          backgroundImage: `http://localhost:3000/files/${instructor.profilePictureUrl}`
            ? `http://localhost:3000/files/${instructor.profilePictureUrl}`
            : `url(/assets/images/Default.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center', // Center the image vertically
          justifyContent: 'center', // Center the image horizontally
        }}
      ></div>

      {/* Profile Info */}
      <div className="info">
        <span className="name">{instructor.name}</span>
        <p className="job">{`Email: ${instructor.email}`}</p>
        <p>{`Age: ${instructor.age}`}</p>
      </div>

      {/* Taught Courses */}
      <div className="courses">
        <h3>Taught Courses</h3>
        <ul>
          {Array.isArray(instructor.Teach_Courses) && instructor.Teach_Courses.length > 0 ? (
            instructor.Teach_Courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))
          ) : (
            <li>No courses taught</li>
          )}
        </ul>
      </div>

      {/* Certificates */}
      <div className="certificates">
        <h3>Certificates</h3>
        <p>{instructor.Certificates || 'No certificates available'}</p>
      </div>

      {/* Button */}
      <a href="/Ins_Home" className="button">
        Return Home
      </a>
    </div>
  );
};

export default Profile;
