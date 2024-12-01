'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

// User.tsx or any other relevant file for types
export interface User {
  email: string;
  name: string;
  age: string;
  passwordHash: string;
  profilePictureUrl?: string; // Optional field
  appliedCourses: string[]; // Array of courses the user wants to apply to
  acceptedCourses: string[]; // Array of courses the user has been accepted into
  score: number; // Default score is 0
}
const Apply_Students: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]); // Holds the list of students
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/instructor/applied-users/omar.hossam3@gmail.com',
        ); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data: User[] = await response.json(); // Parse the response as JSON and map to User[] type
        setStudents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch students');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="students-container">
      <h1 className="title">Applied Students</h1>
      {students.map((student) => (
        <div key={student.email} className="student-card">
          <div className="student-header">
            {student.profilePictureUrl && (
              <img
                className="profile-img"
                src={student.profilePictureUrl}
                alt="Profile"
              />
            )}
            <h3 className="student-name">{student.name}</h3>
          </div>
          <div className="student-info">
            <p>
              <strong>Age:</strong> {student.age}
            </p>
            <p>
              <strong>Score:</strong> {student.score}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Applied Courses:</strong>{' '}
              {student.appliedCourses.join(', ')}
            </p>
            <p>
              <strong>Accepted Courses:</strong>{' '}
              {student.acceptedCourses.join(', ')}
            </p>
          </div>
          <div className="action-buttons">
            <button className="accept-btn">Accept</button>
            <button className="reject-btn">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Apply_Students;
