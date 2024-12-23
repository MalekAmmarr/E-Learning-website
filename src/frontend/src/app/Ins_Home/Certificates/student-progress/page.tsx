'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './page.css';

interface CompletedLecture {
  Coursetitle: string;
  completedLectures: number;
  pdfUrl: string;
}

interface StudentProgress {
  courseTitle: string;
  score: number;
  completionRate: number;
  lastAccessed: string;
  completedLectures: CompletedLecture[];
  notes?: string[];
}

// Helper function to determine the grade based on the score
const getGrade = (score: number): string => {
  if (score > 43) return 'A+';
  if (score > 41) return 'A';
  if (score > 39) return 'A-';
  if (score > 37) return 'B+';
  if (score > 35) return 'B';
  if (score > 33) return 'B-';
  if (score > 31) return 'C+';
  if (score > 29) return 'C';
  if (score > 27) return 'C-';
  if (score > 25) return 'D+';
  if (score > 23) return 'D';
  if (score > 22) return 'D-';
  return 'F'; // Adjust ths as needed for lower scores
};

const StudentProgressPage: React.FC = () => {
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const email = queryParams.get('email');

      if (!email) {
        setError('No email provided');
        setLoading(false);
        return;
      }

      try {
        const accessToken = sessionStorage.getItem('Ins_Token'); // Updated to match token naming convention
        console.log('Access Token:', accessToken);
        const response = await fetch(`http://localhost:3000/instructor/students/${email}/progress`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`, // Add the token to the Authorization header
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch student progress');
        }

        const data = await response.json();
        console.log('Received data:', data);

        const completedLectures = data[0]?.completedLectures || []; // Access the first item in the array

        setStudentProgress({
          courseTitle: data[0]?.courseTitle || '', // Get the courseTitle from the first item
          score: data[0]?.score || 0, // Get the score from the first item
          completionRate: data[0]?.completionRate || 0, // Get the completionRate from the first item
          lastAccessed: '', // Set this to an appropriate value if needed
          completedLectures, // Set the completed lectures
          notes: data.notes || [], // Ensure notes is an array
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProgress();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="student-progress-page">
      <h1>Student Progress</h1>
      {studentProgress ? (
        <div className="student-progress-details">
          <h2>Progress for {studentProgress.courseTitle}</h2>
          <p>Score: {studentProgress.score}</p>
          <p>Final Grade: {getGrade(studentProgress.score)}</p> {/* Displaying final grade */}
          <p>Completion Rate: {studentProgress.completionRate}%</p>
          <h3>Completed Lectures:</h3>
          <ul>
            {studentProgress.completedLectures.length > 0 ? (
              studentProgress.completedLectures.map((lecture, index) => (
                <li key={index}>
                  <strong>{lecture.Coursetitle}</strong> - Completed {lecture.completedLectures} lectures
                  <a href={lecture.pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-link">
                    View PDF
                  </a>
                </li>
              ))
            ) : (
              <p>No completed lectures available.</p>
            )}
          </ul>
          {studentProgress.completionRate >= 100 ? (
            <Link href="/Ins_Home/Certificates/student-progress/certificate">
              <button className="certificate-button">Get Certificate</button>
            </Link>
          ) : (
            <p className="incomplete-message">Student hasn't finished the course yet.</p>
          )}
        </div>
      ) : (
        <p>No progress data found for this student.</p>
      )}
    </div>
  );
};

export default StudentProgressPage;
