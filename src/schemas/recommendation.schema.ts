import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema({ timestamps: true })
export class Recommendation extends Document {
  @Prop({ required: true, unique: true })
  StudentEmail: string; // Reference to the user receiving the recommendation

  @Prop({ required: true, unique: true })
  courseTitle: string; // Recommended course

  @Prop({ type: Number, required: true })
  score: number; // Relevance score of the recommendation

  @Prop({ type: Boolean, default: false })
  isAccepted: boolean; // Whether the user accepted the recommendation

  @Prop({ type: Boolean, default: false })
  isViewed: boolean; // Whether the user viewed the recommendation
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
