'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  
  const quizId = searchParams.get('quizId') || ''; // Retrieve quizId from query parameters

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/instructor/modules/${quizId}`);
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
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/instructor/module/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
          <input
            type="text"
            name="quizId"
            value={formData.quizId}
            onChange={handleInputChange}
            disabled
          />
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
        <label>
          Question Types:
          <input
            type="text"
            name="questionTypes"
            value={formData.questionTypes}
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
              <input
                type="text"
                value={question.questionType}
                onChange={(e) =>
                  handleQuestionChange(index, 'questionType', e.target.value)
                }
                required
              />
            </label>
            <label>
              Options:
              {question.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...question.options];
                    updatedOptions[optionIndex] = e.target.value;
                    handleQuestionChange(index, 'options', updatedOptions);
                  }}
                  required
                />
              ))}
            </label>
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
              <input
                type="text"
                value={question.difficulty}
                onChange={(e) =>
                  handleQuestionChange(index, 'difficulty', e.target.value)
                }
                required
              />
            </label>
          </div>
        ))}
        <button type="submit">Update Module</button>
      </form>
    </div>
  );
};

export default UpdateModule;
