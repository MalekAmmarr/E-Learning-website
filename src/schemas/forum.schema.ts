import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Forum extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  instructorId: string;

  @Prop({ type: [String], default: [] })
  studentIds: string[];
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
