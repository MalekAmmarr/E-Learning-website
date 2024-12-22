import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Progress } from './progress.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: false, default: null })
  oldEmail: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: false })
  profilePictureUrl?: string;

  @Prop({ required: false, default: false })
  HaveEnteredQuiz?: boolean;

  @Prop({ required: false, default: false })
  HaveEnteredMid?: boolean;

  @Prop({ type: [String], default: [] })
  appliedCourses: string[];

  @Prop({ type: [String], default: [] })
  acceptedCourses: string[];

  @Prop({ type: [{ courseTitle: String, score: Number }], default: [] })
  courseScores: { courseTitle: string; score: number }[];

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
        courseTitle: String,
        isfeedbacked: Boolean,
        feedback: [
          {
            question: String,
            studentAnswer: String,
            feedback: String,
          },
        ],
      },
    ],
    default: [],
  })
  feedback: Array<{
    quizId: string;
    courseTitle: string;
    isfeedbacked: boolean;
    feedback: Array<{
      question: string;
      studentAnswer: string;
      feedback: string;
    }>;
  }>;

  @Prop({ type: [String], default: [] })
  Notes: string[];

  @Prop({ default: 0 })
  GPA: number;

  @Prop({
    type: [
      {
        name: String,
        courseTitle: String,
        certificateImageUrl: String,
      },
    ],
    default: [],
  })
  certificates: Array<{
    name: string;
    courseTitle: string;
    certificateImageUrl: string;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
