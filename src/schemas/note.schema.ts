import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true })
  studentEmail: string; // student who take the note

  @Prop({ required: true })
  courseTitle: string;  // Associated course titlee

  @Prop({ required: true })
  content: string; // The content of the note

  @Prop({ required: true })
  timestamp: Date; // The timestamp of when the note was created
}

export const NoteSchema = SchemaFactory.createForClass(Note);
