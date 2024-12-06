import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ required: true })
  studentEmail: string;

  @Prop({ required: true })
  Coursetitle: string;

  @Prop({ required: true, default: 0 })
  score: number; // User's score in this course

  @Prop({ required: true, default: 0 })
  completionRate: number; // Completion rate of the course (0-100)

  @Prop({ type: Date, required: false })
  lastAccessed: Date; // Last date the user accessed the course

 @Prop({ type: [{ Coursetitle: String, completedLectures: Number, pdfUrl: String }], default: [] })
 completedLectures: { Coursetitle: string; completedLectures: number; pdfUrl: string }[]; // Track completed lectures per course
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
