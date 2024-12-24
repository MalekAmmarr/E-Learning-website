import { IsString, IsNotEmpty } from 'class-validator';

export class CreateForumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  instructorId: string;
}