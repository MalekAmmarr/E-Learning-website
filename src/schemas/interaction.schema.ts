import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema({ timestamps: { createdAt: false, updatedAt: 'lastAccessed' } })
export class UserInteraction extends Document {
  @Prop({ required: true, unique: true })
  interactionId: string;

  studentemail: string; // Reference to the student's _id

  @Prop({required: true, ref: Course.name})
  courseId: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  timeSpentMinutes: number;

  @Prop({ required: true })
  lastAccessed: Date;
}

export const UserInteractionSchema = SchemaFactory.createForClass(UserInteraction);
