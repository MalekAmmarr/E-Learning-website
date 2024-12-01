import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true, unique: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  // instructorId will store the ObjectId of a User (MongoDB's auto-generated _id)
 @Prop({ required: true, type: Types.ObjectId, ref: User.name })
 instructorId: Types.ObjectId; // Reference to the instructor's _id (User's ObjectId)

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
