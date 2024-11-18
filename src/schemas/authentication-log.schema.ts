import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'timestamp', updatedAt: false } })
export class AuthenticationLog extends Document {
  @Prop({ required: true, unique: true })
  logId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  event: string;

  @Prop({ required: true })
  status: string; // e.g., "Success", "Failure"
}

export const AuthenticationLogSchema = SchemaFactory.createForClass(AuthenticationLog);
