import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Module extends Document {
  @Prop({ required: true })
  moduleId: string; // Unique identifier for the module

  @Prop({ required: true })
  courseId: string; // Reference to the associated course

  @Prop({ required: true })
  title: string; // Title of the module

  @Prop({ required: true })
  content: string; // Content of the module

  @Prop({ default: 'medium' })
  difficulty: string; // Difficulty level (e.g., "easy", "medium", "hard")
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
