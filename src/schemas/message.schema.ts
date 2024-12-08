import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @Prop({ required: true })
  room: string;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
