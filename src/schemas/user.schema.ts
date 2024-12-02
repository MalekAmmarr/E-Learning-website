import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true }) // Make email unique
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true })
  passwordHash: string;
  // Optional fields
  @Prop({ required: false })
  profilePictureUrl?: string;

  @Prop({ type: [String], default: [] })
  appliedCourses: string[]; // Array of courses the user wants to apply to

  @Prop({ type: [String], default: [] })
  acceptedCourses: string[]; // Array of courses the user has been accepted into

  @Prop({ default: 0 })
  score: number; // Default score is 0

  @Prop({ type: [String], default: [] })
  Notifiction: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
