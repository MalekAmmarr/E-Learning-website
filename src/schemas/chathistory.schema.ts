import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatHistory extends Document {
  @Prop({ required: true })
  messageId: string; // Unique identifier for the message

  @Prop({ required: true })
  senderId: string; // ID of the message sender

  @Prop({ required: true })
  receiverId: string; // ID of the message receiver (use "all" for group chats)

  @Prop({ required: true })
  message: string; // Content of the message

  @Prop({ default: null })
  courseId?: string; // Optional reference to the course for course-specific chats

  @Prop({ default: null })
  threadId?: string; // Optional reference to a discussion thread

  @Prop({ default: Date.now })
  timestamp: Date; // Timestamp of when the message was sent
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
