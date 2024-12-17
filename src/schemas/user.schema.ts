// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Progress } from './progress.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: false })
  profilePictureUrl?: string;

  @Prop({ type: [String], default: [] })
  appliedCourses: string[]; // Array of courses the user wants to apply to

  @Prop({ type: [String], default: [] })
  acceptedCourses: string[]; // Array of courses the user has been accepted into

  @Prop({ type: [{ courseTitle: String, score: Number }], default: [] })
  courseScores: { courseTitle: string; score: number }[]; // Array of objects with course title and score

  @Prop({ type: [String], default: [] })
  Notifiction: string[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Progress',
    default: [],
  })
  progress: Progress[];

  @Prop({
    type: [
      {
        quizId: String,
        feedback: [{ question: String, feedback: String }],
      },
    ],
    default: [],
  })
  feedback: Array<{
    quizId: string;
    courseTitle: string;
    feedback: Array<{ question: string; feedback: string }>;
  }>;

  // Notes tied to specific courses
  @Prop({ type: [String], default: [] })
  Notes: string[];

  // Virtual field to calculate GPA
  @Prop({ default: 0 })
  GPA: number;

  // Virtual function to calculate the GPA
  /*getGPA(): number {
  if (this.courseScores.length === 0) return 0;
  const total = this.courseScores.reduce((acc, scoreObj) => acc + scoreObj.score, 0);
  return total / this.courseScores.length;
}*/
}

export const UserSchema = SchemaFactory.createForClass(User);
