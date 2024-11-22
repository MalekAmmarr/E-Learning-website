import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true, unique: true })
  noteId: string; // Unique identifier for the note or thread

  @Prop({ required: true })
  userId: string; // ID of the user who created the note or thread

  @Prop()
  courseId?: string; // Optional reference to the associated course

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
