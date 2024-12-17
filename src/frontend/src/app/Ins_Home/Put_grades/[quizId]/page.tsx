'use client';
import { useEffect, useState } from 'react';
import './page.css';
import { useRouter, useParams } from 'next/navigation'; // Correctly import Next.js hooks

interface StudentAnswer {
  studentEmail: string;
  answers: string[];
}

const StudentAnswers = () => {
  const params = useParams();
  const quizId = params.quizId;

  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!quizId) return; // Guard for missing quizId

    let isMounted = true; // Cleanup flag

    const fetchStudentAnswers = async () => {
      try {
        const res = await fetch(`http://localhost:3000/quizzes/${quizId}/student-answers`);
        if (!res.ok) throw new Error(`Failed to fetch student answers: ${res.statusText}`);
        const data = await res.json();
        if (isMounted) setStudentAnswers(data);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchStudentAnswers();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [quizId]);

  const handleCardClick = (studentEmail: string) => {
    const validQuizId = Array.isArray(quizId) ? quizId[0] : quizId;

    if (!validQuizId) {
      console.error("Quiz ID is missing or invalid.");
      return;
    }

    router.push(
      `/Ins_Home/Put_grades/${encodeURIComponent(validQuizId)}/GradeQuiz?studentEmail=${encodeURIComponent(studentEmail)}`
    );
  };

  if (!quizId) return <div>Error: Quiz ID is missing.</div>; // Guard for missing quizId

  return (
    <section className="section student-answers" id="student-answers">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="section-heading">
              <h6>Student Answers</h6>
              <h2>Answers for Quiz ID: {quizId}</h2>
            </div>
          </div>
        </div>
        {error ? (
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="error-message">
                <h4>Error: {error}</h4>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {studentAnswers.map((answer, index) => (
              <div
                key={index}
                className="col-lg-4 col-md-6 align-self-center mb-30"
                onClick={() => handleCardClick(answer.studentEmail)}
              >
                <div className="student-answer-card">
                  <h4>{answer.studentEmail}</h4>
                  <ul>
                    {answer.answers.map((ans, idx) => (
                      <li key={idx}>{ans}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentAnswers;
