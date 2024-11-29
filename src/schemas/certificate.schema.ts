import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Certificate extends Document {
  @Prop({ required: true, unique: true })
  certificateId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  issuedAt: Date;

  @Prop()
  certificateUrl?: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
