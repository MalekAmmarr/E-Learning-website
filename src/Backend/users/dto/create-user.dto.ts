// create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  passwordHash: string; // This will be hashed before saving

  @IsEnum(['student', 'instructor', 'admin'])
  role: string;

  /*roleMetadata: Record<string, any>;
  learningPreferences: string[];
  isHardcoded: boolean;
  profilePictureUrl?: string;*/
}
