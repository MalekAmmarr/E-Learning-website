import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Course } from './course.schema';

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop({ required: true })
  studentemail: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  Student_FeedBack_OnCourse: string;

  @Prop({ min: 1, max: 5 })
  rating?: number;

  @Prop()
  createdAt: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
