import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ required: true })
  studentId: string; // Reference to the student

  @Prop({ required: true })
  courseId: string; // Reference to the course

  @Prop({ default: 0 })
  attendanceCount: number; // Number of classes attended by the student

  @Prop({ type: [Date], default: [] })
  attendanceDates: Date[]; // Dates of attendance

  @Prop({ required: true, default: 0 })
  completionPercentage: number; // Progress percentage for the course

  @Prop()
  lastAccessed: Date; // The last time the student accessed the course

  @Prop({ default: true })
  isPresent?: boolean; // Optional field for real-time attendance tracking
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
