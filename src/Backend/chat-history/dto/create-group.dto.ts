import { Schema } from '@nestjs/mongoose';
import {
  IsString,
  IsArray,
  IsOptional,
  IsUrl,
  IsDate,
  ValidateNested,
} from 'class-validator';

import { Message } from 'src/schemas/message.schema';

export class CreateGroupDto {
  @IsString()
  Title: string;

  @IsString()
  Admin: string;
  @IsString()
  @IsOptional()
  privacy: string;
  @IsString()
  CourseTitle: string;

  @IsArray()
  @IsString({ each: true })
  MembersEmail: string[];

  @IsArray()
  @IsString({ each: true })
  MembersName: string[];

  @IsString()
  @IsUrl()
  @IsOptional()
  ProfilePictureUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  messages: Message[];

  @IsOptional()
  @IsDate()
  timestamp?: Date;
}
