// note.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Course } from './course.schema'; // Assuming you have a Course schema

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true, unique: true })
  studentEmail: string;

  @Prop({ required: true })
  Title: string;
  @Prop({ required: false })
  profilePictureUrl?: string;

  @Prop({ type: [String], default: [] })
  notes: string[];

  @Prop({ type: Date, default: Date.now })
  timestamp: Date; // Timestamp for when the note is created or updated
}

export const NoteSchema = SchemaFactory.createForClass(Note);
