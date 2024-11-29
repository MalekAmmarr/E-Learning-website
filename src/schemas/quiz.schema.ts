import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
      },
    ],
  })
  questions: {
    questionId: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];

  @Prop({ required: true })
  difficulty: string; // Values: "easy", "medium", "hard"

  @Prop({
    type: [
      {
        studentId: String, // Reference to the student
        answers: [
          {
            questionId: String,
            studentAnswer: String,
            isCorrect: Boolean,
          },
        ], // Answers submitted by the student
        score: Number, // Total score for this quiz
        submittedAt: Date, // Timestamp of submission
      },
    ],
    default: [],
  })
  responses: {
    studentId: string;
    answers: { questionId: string; studentAnswer: string; isCorrect: boolean }[];
    score: number;
    submittedAt: Date;
  }[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
