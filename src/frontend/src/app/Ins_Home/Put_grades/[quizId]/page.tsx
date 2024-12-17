'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './page.css';

interface StudentEmail {
  studentEmail: string;
  hasFeedback: boolean; // Add hasFeedback field
}

const StudentAnswers = () => {
  const params = useParams();
  const quizId = Array.isArray(params.quizId)
    ? params.quizId[0]
    : params.quizId; // Ensure quizId is a string
  const [studentEmails, setStudentEmails] = useState<StudentEmail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!quizId) return;

    const fetchStudentEmails = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/quizzes/${quizId}/student-answers`, // Update API endpoint
        );
        if (!res.ok)
          throw new Error(`Failed to fetch student emails: ${res.statusText}`);

        const data = await res.json();
        // Map studentEmail and hasFeedback fields
        const emails = data.map((item: any) => ({
          studentEmail: item.studentEmail,
          hasFeedback: item.hasFeedback, // Include the hasFeedback field
        }));
        setStudentEmails(emails);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      }
    };

    fetchStudentEmails();
  }, [quizId]);

  const handleCardClick = (studentEmail: string) => {
    const validQuizId = quizId ?? ''; // Fallback to an empty string if quizId is undefined

    router.push(
      `/Ins_Home/Put_grades/${encodeURIComponent(validQuizId)}/GradeQuiz?studentEmail=${encodeURIComponent(studentEmail)}`,
    );
  };

  if (!quizId)
    return <div className="error-message">Error: Quiz ID is missing.</div>;

  return (
    <section className="section student-answers" id="student-answers">
      <div className="container">
        <div className="section-heading text-center">
          <h6>Student Emails</h6>
          <h2>Quiz ID: {quizId}</h2>
        </div>

        {error ? (
          <div className="error-message text-center">
            <h4>{error}</h4>
          </div>
        ) : (
          <div className="row justify-content-center">
            {studentEmails.length > 0 ? (
              studentEmails.map(({ studentEmail, hasFeedback }, index) => (
                <div
                  key={index}
                  className="col-lg-3 col-md-4 col-sm-6 mb-4"
                  onClick={() => handleCardClick(studentEmail)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="student-card text-center p-3 shadow-sm rounded">
                    <h5 className="mb-0">
                      {studentEmail} {hasFeedback && <span>(Feedbacked)</span>}
                    </h5>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No student emails available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentAnswers;
