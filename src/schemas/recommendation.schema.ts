import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Recommendation extends Document {
  @Prop({ required: true })
  title: string; // Title of the recommended course

  @Prop({ required: true })
  category: string; // Category of the recommended course

  @Prop({ type: Number, required: true })
  creditHours: number; // Credit hours of the recommended course

  @Prop({ type: Number, required: true })
  price: number; // Price of the recommended course

  @Prop({ required: false })
  imageUrl?: string; // Image URL for the recommended course
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
