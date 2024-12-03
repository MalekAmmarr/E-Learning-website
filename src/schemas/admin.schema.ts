import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class admin extends Document {
  @Prop({ required: true, unique: true }) // Make email unique
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  passwordHash: string;
  
  // Optional fields
  @Prop({ required: false })
  profilePictureUrl?: string;

}
export const AdminSchema = SchemaFactory.createForClass(admin);