import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsMongoId()
  studentId: Types.ObjectId;; // The student's MongoDB ID

  @IsNotEmpty()
  @IsString()
  content: string; // The content of the note
}
