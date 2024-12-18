import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reply extends Document {
  @Prop({ required: true })
  threadId: string; // Thread that this reply is associated with

  @Prop({ required: true })
  createdBy: string; // User who created the reply

  @Prop({ required: true })
  content: string; // Content of the reply

  @Prop({ default: 0 })
  likes: number; // Number of likes this reply has

  createdAt: Date;
  updatedAt: Date;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
