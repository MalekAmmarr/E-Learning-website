import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true, unique: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  instructorId: string; // Reference to the instructor's userId

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

  @Prop({ required: true })
  createdBy: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
