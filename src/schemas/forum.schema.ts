import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';



@Schema()
export class Forum extends Document {

  @Prop({ required: true })
  courseId: string; // Associated course ID

  @Prop({ required: true })
  createdBy: string; 
}

export const ForumSchema = SchemaFactory.createForClass(Forum);