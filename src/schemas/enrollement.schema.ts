import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @Prop({ required: true })
  studentId: string; // Reference to the student

  @Prop({ required: true })
  courseId: string; // Reference to the course

  @Prop({ default: false })
  isCompleted: boolean; // Indicates if the student has completed the course

  @Prop({ default: false })
  isDropped: boolean; // Indicates if the student was dropped due to absenteeism
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
