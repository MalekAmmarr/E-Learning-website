import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Module } from './module.schema';

@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ required: true, unique: true })
  quizId: string;

  @Prop({ required: true })
  moduleId: string; // Reference to the associated module

  @Prop({
    type: [
      {
        questionId: String, // Unique ID for the question
        questionText: String,
        options: [String], // Array of answer options
        correctAnswer: String,
        explanation: String, // Explanation for the correct answer
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }, // Difficulty level
      },
    ],
  })
  questions: {
    questionId: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: string; // Track difficulty level for each question
  }[];

  @Prop({ required: true })
  difficulty: string; // Default difficulty of the quiz

  @Prop({
    type: [
      {
        studentId: { type: Types.ObjectId, ref: User.name, required: true }, // Reference to the student
        answers: [
          {
            questionId: String,
            studentAnswer: String,
            isCorrect: Boolean,
            difficulty: String, // Track difficulty for each answer
          },
        ], // Answers submitted by the student
        score: { type: Number, required: true }, // Total score for this quiz
        submittedAt: { type: Date, required: true }, // Timestamp of submission
      },
    ],
    default: [],
  })
  responses: {
    studentId: Types.ObjectId; // Reference to the student's userId
    answers: { questionId: string; studentAnswer: string; isCorrect: boolean; difficulty: string }[]; // Track difficulty of answers
    score: number;
    submittedAt: Date;
  }[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
