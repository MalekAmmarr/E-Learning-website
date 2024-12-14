import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: string; // Reference to the Course

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string; // Sender's User ID

  @Prop({ required: true })
  content: string; // Message content

  @Prop({ required: true })
  senderName: string; // Name of the sender (for display purposes)
}

export const MessageSchema = SchemaFactory.createForClass(Message);
