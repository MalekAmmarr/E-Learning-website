'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

const Putgrades = () => {
  const [quizIds, setQuizIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [instructorEmail, setInstructorEmail] = useState<string>('');  
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const storedInstructor = localStorage.getItem('instructorData');
        if (storedInstructor) {
          const { email } = JSON.parse(storedInstructor);
          setInstructorEmail(email); // Store the email for later use
  
          const res = await fetch(`http://localhost:3000/quizzes/instructor/by-instructor?email=${encodeURIComponent(email)}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch quizzes: ${res.statusText}`);
          }
  
          const data: string[] = await res.json();
          setQuizIds(data);
        } else {
          setError('Instructor data not found.');
        }
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuizzes();
  }, [router]);

  const handleQuizClick = (quizId: string) => {
    router.push(`/Ins_Home/Put_grades/${encodeURIComponent(quizId)}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="section quizzes" id="quizzes">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="section-heading">
              <h6>Available Quizzes</h6>
              <h2>Quizzes You Created</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {quizIds.map((quizId, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 mb-30"
              onClick={() => handleQuizClick(quizId)}
            >
              <div className="quiz-card">
                <h4>{quizId}</h4>
                <p>Click to manage feedbacks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Putgrades;
