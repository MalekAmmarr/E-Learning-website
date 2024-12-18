import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { Instructor } from './instructor.schema';
import { Note } from './note.schema';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true, unique: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  instructormail: string;

  @Prop()
  instructorName?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficultyLevel: string;

  @Prop({ default: false })
  isArchived: boolean; // If true, only instructors can access the course

  @Prop({ required: true })
  totalClasses: number; // Total number of classes in the course

  @Prop({ type: [String], default: [] })
  courseContent: string[]; // Array of PDF URLs/paths

  // Add a reference to the Note schema using ObjectId
  @Prop({ type: [String], default: [] })
  notes: string[];

  // Add price and image properties
  @Prop({ required: true })
  price: number;  // Price of the course

  @Prop({ required: true })
  image: string;  // URL or path to the course image
}

export const CourseSchema = SchemaFactory.createForClass(Course);
