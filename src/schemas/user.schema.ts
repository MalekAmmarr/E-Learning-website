import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';


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

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string;
  
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  roleMetadata: Record<string, any>;// store the rols depending on the user type

  @Prop()
  profilePictureUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
