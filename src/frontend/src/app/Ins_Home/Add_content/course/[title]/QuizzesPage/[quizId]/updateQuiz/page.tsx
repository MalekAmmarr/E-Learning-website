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

const UpdateQuizPage = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedQuiz, setUpdatedQuiz] = useState<Quiz | null>(null);

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
        setUpdatedQuiz(data); // Set the initial quiz data for editing
      } catch (err) {
        setError('Failed to load quiz content');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizContent();
  }, [params.quizId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    field: keyof Quiz['questions'][0], // Ensure that 'field' is a key of the question object
    optionIndex?: number // Optionally include an index for the 'options' field
  ) => {
    const updatedQuestions = [...updatedQuiz!.questions];
  
    if (field === 'options' && optionIndex !== undefined) {
      // If the field is 'options' and optionIndex is provided, update the specific option
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = e.target.value; // Update the specific option
      updatedQuestions[questionIndex].options = updatedOptions; // Reassign the updated options array
    } else if (field !== 'options') {
      // If the field is not 'options', directly assign the value
      updatedQuestions[questionIndex][field] = e.target.value;
    }
  
    setUpdatedQuiz({
      ...updatedQuiz!,
      questions: updatedQuestions,
    });
  };
  
  
  
  

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:3000/quizzes/${params.quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuiz),
      });

      if (!res.ok) {
        throw new Error('Failed to update quiz content');
      }

      const data = await res.json();
      router.push(`/Ins_Home/Add_content/course/${updatedQuiz!.courseTitle}/QuizzesPage/${params.quizId}`); // Navigate back to the quiz content page
    } catch (err) {
      setError('Failed to update quiz content');
    }
  };

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
      <h1 className="quiz-title">Edit Quiz: {quiz.quizType}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="question-container">
        {quiz.questions.map((question, questionIndex) => (
  <div key={questionIndex}>
    <p>{question.question}</p>
    {question.options.map((option, optionIndex) => (
      <div key={optionIndex}>
        <input
          type="text"
          value={option}
          onChange={(e) =>
            handleInputChange(e, questionIndex, 'options', optionIndex) // Pass the optionIndex here
          }
        />
      </div>
    ))}
  </div>
))}


        </div>
        <button type="button" onClick={handleSubmit}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateQuizPage;
