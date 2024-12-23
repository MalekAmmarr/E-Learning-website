'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './page.css';

interface Question {
  question: string;
  questionType: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
}

interface ModuleState {
  quizId: string;
  courseTitle: string;
  instructorEmail: string;
  quizType: string;
  questionTypes: string;
  questions: Question[];
}

const UpdateModule = () => {
  const [formData, setFormData] = useState<ModuleState>({
    quizId: '',
    courseTitle: '',
    instructorEmail: '',
    quizType: '',
    questionTypes: '',
    questions: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const accessToken = sessionStorage.getItem('Ins_Token');
        const res = await fetch(`http://localhost:3000/modules/details-by-quiz-id?quizId=${quizId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setFormData(data);
        } else {
          throw new Error('Failed to fetch module data');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message || 'An error occurred while fetching the module data');
        } else {
          alert('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchModuleData();
    }
  }, [quizId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string | string[]
  ) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedQuestion = { ...updatedQuestions[index], [field]: value };

      updatedQuestions[index] = updatedQuestion;
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const addQuestion = () => {
    setFormData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        { question: '', questionType: 'MCQ', options: [], correctAnswer: '', difficulty: 'easy' },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions.splice(index, 1);
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure that True/False questions have exactly 2 options and MCQ questions have 4 options
    for (const question of formData.questions) {
      if (question.questionType === 'True/False' && question.options.length !== 2) {
        alert('True/False questions must have exactly two options.');
        return;
      }
      if (question.questionType === 'MCQ' && question.options.length !== 4) {
        alert('MCQ questions must have exactly four options.');
        return;
      }
    }

    const questionTypesSet = new Set(formData.questions.map((q) => q.questionType));
    const questionTypes = Array.from(questionTypesSet).join(', ');

    try {
      const accessToken = sessionStorage.getItem('Ins_Token');
      const res = await fetch(`http://localhost:3000/modules/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...formData, questionTypes }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update module: ${res.statusText}`);
      }

      alert('Module updated successfully!');
      router.push('/Ins_Home');
    } catch (err: any) {
      alert(err.message || 'An unknown error occurred');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Update Module</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Quiz ID:
          <input type="text" name="quizId" value={formData.quizId} disabled />
        </label>
        <label>
          Course Title:
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Instructor Email:
          <input
            type="email"
            name="instructorEmail"
            value={formData.instructorEmail}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Quiz Type:
          <input
            type="text"
            name="quizType"
            value={formData.quizType}
            onChange={handleInputChange}
            required
          />
        </label>

        <h2>Questions</h2>
        {formData.questions.map((question, index) => (
          <div key={index}>
            <label>
              Question:
              <input
                type="text"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(index, 'question', e.target.value)
                }
                required
              />
            </label>
            <label>
              Question Type:
              <select
                value={question.questionType}
                onChange={(e) =>
                  handleQuestionChange(index, 'questionType', e.target.value)
                }
              >
                <option value="MCQ">MCQ</option>
                <option value="True/False">True/False</option>
              </select>
            </label>

            {question.questionType === 'MCQ' && (
              <div>
                <label>Options:</label>
                {Array.from({ length: 4 }).map((_, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={question.options[optionIndex] || ''}
                    onChange={(e) => {
                      const updatedOptions = [...question.options];
                      updatedOptions[optionIndex] = e.target.value;
                      handleQuestionChange(index, 'options', updatedOptions);
                    }}
                    required
                  />
                ))}
              </div>
            )}

            {question.questionType === 'True/False' && (
              <div>
                <label>Options:</label>
                {['True', 'False'].map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={question.options[optionIndex] || option}
                    onChange={(e) => {
                      const updatedOptions = [...question.options];
                      updatedOptions[optionIndex] = e.target.value;
                      handleQuestionChange(index, 'options', updatedOptions);
                    }}
                    required
                  />
                ))}
              </div>
            )}

            <label>
              Correct Answer:
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, 'correctAnswer', e.target.value)
                }
                required
              />
            </label>
            <label>
              Difficulty:
              <select
                value={question.difficulty}
                onChange={(e) =>
                  handleQuestionChange(index, 'difficulty', e.target.value)
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <button type="button" onClick={() => removeQuestion(index)}>
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        <button type="submit">Update Module</button>
      </form>
    </div>
  );
};

export default UpdateModule;
