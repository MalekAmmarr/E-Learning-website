import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Thread extends Document {
  @Prop({ required: true })
  courseId: string; // ID of the course this thread belongs to

  @Prop({ required: true })
  title: string; // Thread title

  @Prop({ required: true })
  createdBy: string; // User who created the thread

  @Prop({ default: '' })
  content: string; // Content of the thread

  @Prop({ default: 0 })
  repliesCount: number; // Number of replies this thread has

  @Prop({ default: false })
  isClosed: boolean; // Flag to indicate if the thread is closed for further replies

  createdAt: Date;
  updatedAt: Date;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
