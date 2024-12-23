'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './page.css';

const CreateQuiz = () => {
  const [formData, setFormData] = useState({
    instructorEmail: '',
    quizId: '',
    quizType: '',
    numberOfQuestions: 0,
    courseTitle: '',
  });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();

  const courseTitle = Array.isArray(params.title) ? params.title[0] : params.title;
  if (!courseTitle) {
    throw new Error('Invalid course title');
  }

  useEffect(() => {
    const storedInstructor = localStorage.getItem('instructorData');
    if (storedInstructor) {
      const { email } = JSON.parse(storedInstructor);
      setFormData((prev) => ({
        ...prev,
        instructorEmail: email,
        courseTitle, // Set course title here
      }));
    } else {
      setError('Instructor data not found. Please log in again.');
    }
  }, [courseTitle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'numberOfQuestions' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting formData:', formData); // Debugging step
      const res = await fetch(`http://localhost:3000/quizzes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error('Error response from server:', errorResponse);
        throw new Error(errorResponse.message || 'Failed to create quiz');
      }

      alert('Quiz created successfully!');
      router.push(`/Ins_Home/Add_content/course/${encodeURIComponent(courseTitle)}/QuizzesPage`);
    } catch (err: any) {
      console.error('Error during quiz creation:', err);
      setError(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Instructor Email:
          <input
            type="email"
            name="instructorEmail"
            value={formData.instructorEmail}
            readOnly
            required
          />
        </label>
        <label>
          Quiz ID:
          <input
            type="text"
            name="quizId"
            value={formData.quizId}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Quiz Type:
          <select name="quizType" value={formData.quizType} onChange={handleInputChange} required>
            <option value="">Select Type</option>
            <option value="Small">Small</option>
            <option value="Midterm">Midterm</option>
            <option value="Final">Final</option>
          </select>
        </label>
        <label>
          Number of Questions:
          <input
            type="number"
            name="numberOfQuestions"
            value={formData.numberOfQuestions}
            onChange={handleInputChange}
            required
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
