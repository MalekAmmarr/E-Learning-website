// reply.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reply extends Document {
  @Prop({ required: true })
  threadId: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  content: string;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);