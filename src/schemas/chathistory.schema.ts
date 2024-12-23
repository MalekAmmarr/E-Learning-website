import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from './message.schema';

@Schema({ timestamps: true })
export class ChatHistory extends Document {
  @Prop({ required: true })
  Title: string; // Unique identifier for the message

  @Prop({ required: true })
  Admin: string; // Unique identifier for the message
  @Prop({ required: true })
  CourseTitle: string; // Unique identifier for the message

  @Prop({ type: [String], default: [] })
  MembersEmail: string[];

  @Prop({ type: [String], default: [] })
  MembersName: string[];

  @Prop({ required: true })
  ProfilePictureUrl: string; // ID of the message receiver (use "all" for group chats)

  @Prop({ type: [Message], required: true, default: [] })
  messages: [Message]; // Content of the message

  @Prop({ default: Date.now })
  timestamp: Date; // Timestamp of when the message was sent
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
