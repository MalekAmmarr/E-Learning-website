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
  const [user, setUser] = useState<Instructor | null>(null); // Single user object
  const router = useRouter();

  const fetchUserDetails = async (
    email: string,
    accessToken: string
  ): Promise<Instructor> => {
    try {
      const response = await fetch(
        `http://localhost:3000/instructor/${email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Assuming Bearer token is used for authorization
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const data: Instructor = await response.json();
      setUser(data); // Update state with user data
      return data; // Return the fetched user data
    } catch (error) {
      console.error('Error fetching Instructor details', error);
      throw error; // Propagate the error for the caller to handle
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = sessionStorage.getItem('Ins_Token');
      if (!token) {
        throw new Error('Authorization token not found. Please log in again.');
      }

      const userData = sessionStorage.getItem('instructorData');
      if (!userData) {
        throw new Error('Instructor data not found. Please log in again.');
      }

      const { email } = JSON.parse(userData); // Extract email from instructor data

      const response = await fetch(
        `http://localhost:3000/admins/instructors/${encodeURIComponent(email)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.statusText}`);
      }

      alert(`Account with email "${email}" successfully deleted.`);

      // Clear session storage and redirect to login page
      sessionStorage.removeItem('Ins_Token');
      sessionStorage.removeItem('instructorData');
      router.push('/Ins_login');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while trying to delete your account.');
    }
  };

  useEffect(() => {
    try {
      const userData = sessionStorage.getItem('instructorData');
      const accessToken = sessionStorage.getItem('Ins_Token');
      if (userData) {
        if (accessToken) {
          const parsedData: Instructor = JSON.parse(userData); // Parse the single user object
          fetchUserDetails(parsedData.email, accessToken);
        } else router.push('/Ins_login');
      } else {
        router.push('/Ins_login');
      }
    } catch (err) {
      console.error(
        'Failed to retrieve or parse Instructor data from sessionStorage',
        err
      );
      router.push('/Ins_login');
    }
  }, [router]);

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
      </div>

      {/* Applied and Accepted Courses */}
      <div className="courses" style={{ marginBottom: '20px' }}>
        <h3>Teaches Courses</h3>
        <ul>
          {user.Teach_Courses.length > 0 ? (
            user.Teach_Courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))
          ) : (
            <li>No Teached courses</li>
          )}
        </ul>
      </div>
      {/* Buttons */}
      <div
        className="button-container"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <a
          href="/Ins_Home"
          className="button"
          style={{ flex: 1, marginRight: '10px' }}
        >
          Return Home
        </a>
        <a
          href="/Ins_Home/Profile/EditProfile"
          className="button edit-button"
          style={{ flex: 1, marginRight: '10px' }}
        >
          Edit Profile
        </a>
        <button
          onClick={handleDeleteAccount}
          className="button delete-button"
          style={{
            flex: 1,
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
