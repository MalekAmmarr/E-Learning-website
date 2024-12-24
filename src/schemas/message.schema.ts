import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  senderEmail: string; // Unique identifier for the message
  @Prop({ required: false })
  senderName: string; // Unique identifier for the message

  @Prop({ required: true })
  message: string; // Unique identifier for the message

  @Prop({ required: true })
  ProfilePictureUrl: string; // ID of the message receiver (use "all" for group chats)
  @Prop({ required: true })
  privacy: string; // ID of the message receiver (use "all" for group chats)

  @Prop({ default: Date.now })
  timestamp: Date; // Timestamp of when the message was sent
}

export const MessageSchema = SchemaFactory.createForClass(Message);
