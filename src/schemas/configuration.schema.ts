import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: false, updatedAt: 'updatedAt' } })
export class Configuration extends Document {
  @Prop({ required: true, unique: true })
  configId: string;

  @Prop({ type: Object, required: true })
  settings: Record<string, any>;

  @Prop({ required: true })
  updatedBy: string;

  @Prop({ required: true })
  updatedAt: Date;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
