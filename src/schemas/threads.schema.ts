// thread.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Thread extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  forumId: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ type: [String], default: [] })
  replyIds: string[];
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);