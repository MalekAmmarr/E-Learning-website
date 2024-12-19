'use client';

import React, { useEffect, useState } from 'react';
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
        const response = await fetch(`http://localhost:3000/instructor/students/${email}/progress`);
        if (!response.ok) {
          throw new Error('Failed to fetch student progress');
        }

        const data = await response.json();
        console.log('Received data:', data);

        // Check if the data is structured correctly and extract the completed lectures
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
        </div>
      ) : (
        <p>No progress data found for this student.</p>
      )}
    </div>
  );
};

export default StudentProgressPage;
