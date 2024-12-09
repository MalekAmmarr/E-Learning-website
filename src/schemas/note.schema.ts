// note.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Course } from './course.schema'; // Assuming you have a Course schema

@Schema({ timestamps: true })
export class Note extends Document {

  @Prop ({required:true})
  studentEmail:string
  
  @Prop({ required: true })
  content: string; // Content of the note

  @Prop({ required:true})
  courseId: string // Reference to the Course model

  @Prop({ type: Date, default: Date.now })
  timestamp: Date; // Timestamp for when the note is created or updated
}

export const NoteSchema = SchemaFactory.createForClass(Note);