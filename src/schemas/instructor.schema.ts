import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Instructor extends Document {
  @Prop({ required: true, unique: true }) // Make email unique
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: [String], default: [] })
  Teach_Courses: string[]; // Array of courses the user wants to apply to

  // Optional fields
  @Prop({ required: false })
  profilePictureUrl?: string;

  @Prop({ default: 0 })
  Certificates: string; // Default score is 0
}
export const InstructorSchema = SchemaFactory.createForClass(Instructor);
