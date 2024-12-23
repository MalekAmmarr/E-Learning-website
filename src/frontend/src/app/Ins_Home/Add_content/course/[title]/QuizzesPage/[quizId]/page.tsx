'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './page.css'; // Import CSS for quiz content page

type Quiz = {
  quizId: string;
  quizType: string;
  courseTitle: string;
  instructorEmail: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
};

const QuizContentPage = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();

  if (!params.quizId || Array.isArray(params.quizId)) {
    return <div>Error: Invalid quiz ID</div>;
  }

  useEffect(() => {
    const fetchQuizContent = async () => {
      try {
        const res = await fetch(`http://localhost:3000/quizzes/${params.quizId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch quiz content');
        }
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        setError('Failed to load quiz content');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizContent();
  }, [params.quizId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!quiz) {
    return <div className="error">No quiz found.</div>;
  }

  return (
    <div className="quiz-content-container">
      <h1 className="quiz-title">Quiz: {quiz.quizType}</h1>
      <p>Course Title: {quiz.courseTitle}</p>
      <p>Instructor: {quiz.instructorEmail}</p>
      <div className="questions-container">
        {quiz.questions.map((q, index) => (
          <div key={index} className="question-item">
            <p className="question-text">{index + 1}. {q.question}</p>
            <ul className="options-list">
              {q.options.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        className="edit-quiz-button"
        onClick={() =>
          router.push(`/Ins_Home/Add_content/course/${encodeURIComponent(quiz.courseTitle)}/QuizzesPage/${encodeURIComponent(quiz.quizId)}/updateQuiz`)
        }
      >
        Edit Quiz
      </button>
    </div>
  );
};

export default QuizContentPage;
