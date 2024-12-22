import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema()
export class Group extends Document {
  @Prop({ required: true })
  name: string; // Name of the study group

  @Prop({ required: true })
  courseId: string; // Associated course ID

  @Prop({ type: [String], default: [] })
  members: string[]; // Array of user IDs

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' })
  instructorId: string; // Optional instructor in the group
}

export const GroupSchema = SchemaFactory.createForClass(Group);
