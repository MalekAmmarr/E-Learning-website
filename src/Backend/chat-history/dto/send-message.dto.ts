import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class SendMessageDto {
  @IsEmail()
  @IsNotEmpty()
  senderEmail: string;

  @IsOptional()
  @IsString()
  senderName?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUrl()
  @IsNotEmpty()
  ProfilePictureUrl: string;

  @IsNotEmpty()
  timestamp?: Date;
}
