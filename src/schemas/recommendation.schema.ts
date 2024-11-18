import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'generatedAt', updatedAt: false } })
export class Recommendation extends Document {
  @Prop({ required: true, unique: true })
  recommendationId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String], required: true })
  recommendedItems: string[];

  @Prop({ required: true })
  generatedAt: Date;
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
