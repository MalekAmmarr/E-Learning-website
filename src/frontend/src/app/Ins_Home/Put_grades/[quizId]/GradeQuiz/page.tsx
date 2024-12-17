'use client';

import { useEffect, useState } from 'react';
import './page.css';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

interface StudentAnswer {
  studentEmail: string;
  answers: string[];
}

const StudentAnswers = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;
  if (!quizId) {
    console.error('Quiz ID is missing or invalid.');
    return;
  }

  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]); // State to store feedback for each answer

  const router = useRouter();

  useEffect(() => {
    if (!quizId) return;

    const email = new URLSearchParams(window.location.search).get('studentEmail');
    setStudentEmail(email);

    if (!email) {
      setError('Student email is missing.');
      return;
    }

    const fetchStudentAnswers = async () => {
      const email = new URLSearchParams(window.location.search).get('studentEmail');
      setStudentEmail(email);

      if (!email) {
        setError('Student email is missing.');
        return;
      }

      const apiUrl = `http://localhost:3000/quizzes/${encodeURIComponent(quizId)}/slecetedstudent-answers?studentEmail=${email}`;
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Failed to fetch student answers: ${res.statusText}`);
        const data = await res.json();

        if (data && typeof data === 'object' && data.studentEmail && Array.isArray(data.answers)) {
          setStudentAnswers(data);
          setFeedback(new Array(data.answers.length).fill('')); // Initialize feedback array with empty strings
        } else {
          throw new Error('Invalid data format received from the server.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchStudentAnswers();
  }, [quizId]);

  const handleFeedbackChange = (index: number, value: string) => {
    const newFeedback = [...feedback];
    newFeedback[index] = value;
    setFeedback(newFeedback);
  };

  const handleGradeClick = async () => {
    if (!quizId || !studentEmail || !studentAnswers) return;
  
    const feedbackData = {
      quizId,
      studentEmail,
      feedback,
    };
  
    // Retrieve the token from localStorage (or wherever it is stored)
    const token = localStorage.getItem('Ins_Token'); // Adjust this according to where you store the token
  
    if (!token) {
      setError('Authorization token is missing.');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3000/quizzes/giveFeedback', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the Bearer token here
        },
        body: JSON.stringify(feedbackData),
      });
  
      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }
  
      alert('Feedback submitted successfully!');
      router.push(`/Ins_Home/Put_grades/${encodeURIComponent(quizId)}/GradeQuiz`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  

  if (!quizId) return <div>Error: Quiz ID is missing.</div>;
  if (!studentEmail) return <div>Error: Student email is missing.</div>;

  return (
    <section className="student-answers-container">
      <div className="content-wrapper">
        <div className="heading">
          <h6>Student Answers</h6>
          <h2>Answers for Quiz ID: {quizId}</h2>
          <h3>Student Email: {studentEmail}</h3>
        </div>
        {error ? (
          <div className="error-message">
            <h4>Error: {error}</h4>
          </div>
        ) : studentAnswers ? (
          <div className="answers-card">
            <h4>{studentAnswers.studentEmail}</h4>
            <ul>
              {studentAnswers.answers.map((ans, idx) => (
                <li key={idx}>
                  <div>
                    <strong>Answer {idx + 1}:</strong> {ans}
                    <textarea
                      value={feedback[idx] || ''}
                      onChange={(e) => handleFeedbackChange(idx, e.target.value)}
                      placeholder="Write feedback..."
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button className="grade-button" onClick={handleGradeClick}>
              Grade
            </button>
          </div>
        ) : (
          <div className="loading-message">
            <h4>Loading student answers...</h4>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentAnswers;
