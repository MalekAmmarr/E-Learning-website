'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import './page.css';

export interface Instructor {
  _id: string;
  email: string;
  name: string;
  age: string;
  passwordHash: string;
  Teach_Courses: string[];
  Certificates: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Student {
  email: string;
  name: string;
  age: string;
  profilePictureUrl?: string;
  appliedCourses: string[];
  acceptedCourses: string[];
  courseScores: { courseTitle: string; score: number }[];
  Notifiction: string[];
  Notes: string[];
  GPA: number;
}

const CertificatesPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const storedInstructor = localStorage.getItem('instructorData');
        if (storedInstructor) {
          const parsedInstructor = JSON.parse(storedInstructor);
          setInstructor(parsedInstructor);

          const response = await fetch(`http://localhost:3000/instructor/${parsedInstructor?.email}/students-progress`);
          if (!response.ok) {
            throw new Error('Failed to fetch students');
          }

          const data = await response.json();
          setStudents(data.students);
        } else {
          setError('Instructor data not found.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleCardClick = (email: string) => {
    // Navigate to the student progress page with the email as a query parameter
    router.push(`/Ins_Home/Certificates/student-progress?email=${email}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="certificates-page">
      <h1>Certificates</h1>
      <p>Here is the list of students who have taken your courses:</p>
      {students.length > 0 ? (
        <ul className="students-list">
          {students.map((student) => (
            <li key={student.email} className="student-item">
              <div className="student-card" onClick={() => handleCardClick(student.email)}>
                <img
                  src={student.profilePictureUrl || '/default-profile.png'}
                  alt={`${student.name}'s profile`}
                  className="student-profile-picture"
                />
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p>Email: {student.email}</p>
                  <p>Age: {student.age}</p>
                  <p>Accepted Courses: {student.acceptedCourses.join(', ') || 'None'}</p>
                  <p>GPA: {student.GPA.toFixed(2)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found for your courses.</p>
      )}
    </div>
  );
};

export default CertificatesPage;
