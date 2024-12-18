'use client'; // This marks the component as a client component
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import './page.css';

export interface User {
  email: string;
  name: string;
  age: string;
  passwordHash: string;
  profilePictureUrl?: string;
  appliedCourses: string[];
  acceptedCourses: string[];
  courseScores: { courseTitle: string; score: number }[];
  Notifiction: string[];
  feedback: Array<{
    quizId: string;
    courseTitle: string;
    feedback: Array<{ question: string; feedback: string }>;
  }>;
  Notes: string[];
  GPA: number;
}

interface Question {
  _id: string;
  question: string;
  questionType: string;
  options: string[];
  correctAnswer: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const Quiz = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<Question[] | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]); // Store answers
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [CorrectAnswers, SetCorrectAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number>();
  const [userLevel, setUserLevel] = useState(''); // Track user's level
  const [quizSubmitted, setQuizSubmitted] = useState(false); // Track submission status
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    if (user && accessToken) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
    } else {
      router.push('/login');
    }

    fetchQuiz();
  }, []);
  useEffect(() => {
    extractCorrectAnswers();
    console.log(CorrectAnswers);
  }, []);

  const fetchQuiz = async () => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const courseTitle = queryParams.get('title');
      const user = localStorage.getItem('userData');
      const quizId = queryParams.get('quiz_id');

      let email = 'Nothing';
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        email = parsedUser.email;
      }

      if (!courseTitle) {
        console.error('courseTitle not provided in URL');
        return;
      }

      const response = await fetch('http://localhost:3000/quizzes/startQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          email,
          quizId: quizId,
          courseTitle: courseTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course content');
      }

      const data = await response.json();
      setQuizData(data.questionsWithAnswers);
      console.log('Questions :', data.questionsWithAnswers);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quizData?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      extractCorrectAnswers();
    }
  };
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const email = userData?.email;

      if (!email || !quizData) {
        console.error('Missing necessary data');
        return;
      }

      // Step 2: Calculate the score and compare answers
      const userScore = answers.filter(
        (answer, index) => answer === CorrectAnswers[index],
      ).length;
      setScore(userScore);
      // Determine the user's level based on their score
      let level = '';
      if (userScore >= 0 && userScore <= 3) {
        level = 'Beginner';
      } else if (userScore >= 4 && userScore <= 7) {
        level = 'Intermediate';
      } else {
        level = 'Professional';
      }
      setUserLevel(level);
      const queryParams = new URLSearchParams(window.location.search);
      const courseTitle = queryParams.get('title');
      const quizId = queryParams.get('quiz_id');
      const response = await fetch('http://localhost:3000/quizzes/submitQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          email,
          score: userScore,
          quizId: quizId,
          answers,
          CourseTitle: courseTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
      // Set quiz submission status to true to show results
      setQuizSubmitted(true);
      // You could also store score and feedback for showing later
      console.log('Your score is: ', userScore);

      // Optionally, save the score or feedback in the user profile or show a modal with the score
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };
  const extractCorrectAnswers = () => {
    if (quizData) {
      // Ensure quizData is defined
      const correctAnswers = quizData
        .map((question) => question.correctAnswer)
        .flat();
      SetCorrectAnswers(correctAnswers); // Store the correct answers in the state
    }
  };
  // Function to handle note title click
  const HandleBackHome = () => {
    router.push(`/User_Home`);
  };
  // If the quiz is submitted, show the results within the form, but hide questions and buttons
  if (quizSubmitted) {
    let levelMessage = '';

    // Determine message based on user level
    if (userLevel === 'Beginner') {
      levelMessage = 'Great start! Keep practicing to improve your skills.';
    } else if (userLevel === 'Intermediate') {
      levelMessage = 'Well done! You’re on the right track.';
    } else if (userLevel === 'Professional') {
      levelMessage = 'Amazing job! You are a true quiz master.';
    }

    return (
      <div className="quiz-form">
        <div className="quiz-results">
          <h2 className="score-heading">Your Score: {score}</h2>
          <h3 className="level-heading">Level: {userLevel}</h3>
          <p className="level-message">{levelMessage}</p>
          <button className="back-home-button" onClick={() => HandleBackHome()}>
            Back Home
          </button>
        </div>
      </div>
    );
  }
  if (!quizData) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="quiz-form">
      <div className="radio-input">
        <div className="info">
          <span className="question">{currentQuestion.question}</span>
          <span className="steps">
            {currentQuestionIndex + 1} / {quizData.length}
          </span>
        </div>
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`option-${index}`}
              name={`question-${currentQuestion._id}`}
              value={option}
              checked={answers[currentQuestionIndex] === option}
              onChange={() => handleAnswerChange(option)}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
        <div className="controls">
          {currentQuestionIndex > 0 && (
            <button onClick={handleBack} className="back">
              Back
            </button>
          )}
          {currentQuestionIndex < quizData.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button className="submit" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
