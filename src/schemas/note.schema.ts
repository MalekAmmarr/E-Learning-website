import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true, unique: true })
  noteId: string; // Unique identifier for the note or thread

  @Prop({ required: true })
  studentId: string; // Reference to the student's (MongoDB's auto-generated _id)

  @Prop({required: true })
  courseId: string;

  @Prop({ required: true })
  content: string; // Content of the note or thread

  @Prop({ default: false })
  isThread: boolean; // Indicates if this is a thread (true) or a regular note (false)

  @Prop({
    type: [
      {
        commentId: String, // Unique identifier for the comment
        commenterId: String, // ID of the user who posted the comment
        commentText: String, // Text of the comment
        timestamp: Date, // Time when the comment was posted
      },
    ],
    default: [],
  })
  comments: {
    commentId: string;
    commenterId: string;
    commentText: string;
    timestamp: Date;
  }[];

  @Prop()
  lastUpdated: Date; // Timestamp of the last update
}

export const NoteSchema = SchemaFactory.createForClass(Note);
