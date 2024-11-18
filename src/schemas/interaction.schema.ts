import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: false, updatedAt: 'lastAccessed' } })
export class UserInteraction extends Document {
  @Prop({ required: true, unique: true })
  interactionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  timeSpentMinutes: number;

  @Prop({ required: true })
  lastAccessed: Date;
}

export const UserInteractionSchema = SchemaFactory.createForClass(UserInteraction);
