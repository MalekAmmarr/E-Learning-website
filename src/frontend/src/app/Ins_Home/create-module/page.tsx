'use client';
import Link from 'next/link';
import React, { useState } from 'react';
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

const CreateModule = () => {
  const [formData, setFormData] = useState<ModuleState>({
    quizId: '',
    courseTitle: '',
    instructorEmail: '',
    quizType: '',
    questionTypes: '',
    questions: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      question: '',
      questionType: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: '',
    };

    setFormData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, newQuestion],
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
      const res = await fetch('http://localhost:3000/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Failed to create module: ${res.statusText}`);
      }

      alert('Module created successfully!');
    } catch (err: any) {
      alert(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div>
      <h1>Create Module</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        <button type="submit">Create Module</button>
      </form>
      <div className="action-buttons-container">
        <Link href={`/Ins_Home/create-module/update-module/${formData.quizId}`}>
          <button className="action-button add-button">Update module</button>
        </Link>
      </div>
    </div>
  );
};

export default CreateModule;
