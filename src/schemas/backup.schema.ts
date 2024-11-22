import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Backup extends Document {
  @Prop({ required: true })
  backupId: string; // Unique identifier for the backup

  @Prop({ required: true })
  backupType: string; // Type of backup (e.g., 'database', 'files', 'course')

  @Prop({ required: true })
  storagePath: string; // Path where the backup is stored

  @Prop({ default: null })
  courseId?: string; // Optional reference to the course (e.g., course-specific backups)

  @Prop({ default: null })
  moduleId?: string; // Optional reference to the module

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp of backup creation
}

export const BackupSchema = SchemaFactory.createForClass(Backup);
