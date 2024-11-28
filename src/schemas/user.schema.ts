import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'], default: 'student' })
  role: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  roleMetadata: Record<string, any>; // Role-specific details (e.g., enrolledCourses, specialization, permissions)

  @Prop({ type: [String], default: [] })
  learningPreferences: string[]; // Example: ["Data Science", "Machine Learning"]

  @Prop({ default: false })
  isHardcoded: boolean; // Distinguish hardcoded admins

  @Prop()
  profilePictureUrl?: string;

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp of account creation

  @Prop({ type: [String], default: [] })
  pendingCourses: string[]; // Courses awaiting instructor/admin approval
}

export const UserSchema = SchemaFactory.createForClass(User);
