import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ required: true })
  quizId: string; // Unique ID for each quiz

  @Prop({ required: true, enum: ['Small', 'Midterm', 'Final'] })
  quizType: string; // Small, Midterm, or Final quiz

  @Prop({ required: true })
  courseTitle: string; // Associated course title

  @Prop({ required: true })
  instructorEmail: string; // Instructor who created the quiz (links to Instructor schema)

  @Prop({ required: true })
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>; // Array of questions with options and correct answers

  @Prop({ type: [[String]], default: [] })
  studentAnswers: string[][]; // Answers provided by the student

  @Prop({ default: false })
  isGraded: boolean; // Whether the quiz has been graded by the instructor
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
