// dto/create-reply.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  threadId: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
