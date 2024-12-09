import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Announcement extends Document {
  @Prop({ required: true })
  title: string; // Title of the announcement

  @Prop({ required: true })
  content: string; // Content of the announcement

  @Prop({ default: new Date() })
  createdAt: Date; // Timestamp for when the announcement was created

}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
