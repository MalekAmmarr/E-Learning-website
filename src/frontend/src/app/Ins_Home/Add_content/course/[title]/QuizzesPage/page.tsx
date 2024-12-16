'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './page.css'; // Importing the CSS file for quizzes page

const QuizzesPage = () => {
  const [quizIds, setQuizIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();

  // Validate the courseTitle parameter
  if (!params.title || Array.isArray(params.title)) {
    throw new Error('Invalid course title');
  }

  const courseTitle = decodeURIComponent(params.title);

  useEffect(() => {
    const fetchQuizIds = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/quizzes/ids-by-course?courseTitle=${encodeURIComponent(courseTitle)}`,
        );
        if (!res.ok) {
          throw new Error('Failed to fetch quiz IDs');
        }
        const data = await res.json();
        setQuizIds(data);
      } catch (err) {
        setError('Failed to load quiz IDs');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizIds();
  }, [params.courseTitle]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="quizzes-container">
      <h1 className="quizzes-title">Quizzes for {params.courseTitle}</h1>
      <div className="quiz-list">
        {quizIds.length === 0 ? (
          <p>No quizzes available for this course.</p>
        ) : (
          <ul>
            {quizIds.map((quizId) => {
              console.log('Quiz ID:', quizId); // Logs each quizId
              return (
                <li key={quizId}>
                  <span className="quiz-id">Quiz ID: {quizId}</span>
                  <button
                    className="view-quiz-button"
                    onClick={() =>
                      router.push(
                        `/Ins_Home/Add_content/course/${encodeURIComponent(courseTitle)}/QuizzesPage/${encodeURIComponent(quizId)}`,
                      )
                    }
                  >
                    View Content
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;
