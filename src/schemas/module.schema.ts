import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Module extends Document {
  @Prop({ required: true })
  courseTitle: string; // Reference to the associated course

  @Prop({ required: true })
  instructorEmail: string; // Instructor who created the question bank

  @Prop({ required: true, enum: ['MCQ', 'True/False', 'Both'] })
  questionTypes: string; // Type of question (MCQ, True/False, or Both)

  @Prop({ default: Date.now })
  lastUpdated: Date; // Last updated time for the question bank

  // Question Bank embedded in the module schema
  @Prop({
    type: [
      {
        question: { type: String, required: true }, // Question text
        questionType: { type: String, required: true, enum: ['MCQ', 'True/False'] }, // Type of question
        options: { type: [String], required: true }, // Options for the MCQ (for True/False, only two options)
        correctAnswer: { type: String, required: true }, // Correct answer
      },
    ],
    default: [],
  })
  questions: {
    question: string;
    questionType: 'MCQ' | 'True/False';
    options: string[];
    correctAnswer: string;
  }[]; // Embedded array of questions
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
