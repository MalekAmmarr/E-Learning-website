import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';
import { Progress } from './progress.schema'; // Import the Progress schema

@Schema({ timestamps: true })
export class Instructor extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  // Profile-related fields
  @Prop({ type: [String], required: true })
  expertise: string[]; // Areas of expertise

  @Prop({ type: [String], required: true })
  teachingInterests: string[]; // Areas the instructor is interested in teaching

  @Prop({ default: '' })
  bio: string; // A short biography

  @Prop({ default: '' })
  profilePictureUrl?: string; // Optional profile picture URL

   // Reference to the courses taught by the instructor (Now strings instead of ObjectIds)
   @Prop({ type: [String], default: [] })
   courses: string[]; // List of course IDs as strings
 
   // Track progress of students in courses taught by the instructor (Now strings instead of ObjectIds)
   @Prop({ type: [String], default: [] })
   studentProgress: string[]; // List of progress IDs as strings

  // Last login timestamp
  @Prop({ default: Date.now })
  lastLogin: Date;

  // Notifications for the instructor
  @Prop({ type: [String], default: [] })
  notifications: string[];



  // Total number of students the instructor is currently managing
  @Prop({ default: 0 })
  totalStudents: number;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
