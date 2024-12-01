import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Enrollement extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  studentId: Types.ObjectId; // Reference to the student's userId

  @Prop({ required: true })
  courseId: string; // Reference to the course

  @Prop({ default: false })
  isCompleted: boolean; // Indicates if the student has completed the course

  @Prop({ default: false })
  isDropped: boolean; // Indicates if the student was dropped due to absenteeism
}

export const EnrollementSchema = SchemaFactory.createForClass(Enrollement);
