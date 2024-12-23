// dto/create-thread.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  forumId: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}