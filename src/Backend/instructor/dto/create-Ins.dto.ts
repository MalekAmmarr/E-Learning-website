import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsPositive,
} from 'class-validator';

// Define the DTO for creating a User
export class CreateInstructorDto {
  @IsString()
  name: string;

  @IsString()
  age: Number; // Age is required and should be a string (or number if preferred)

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsArray()
  @IsString({ each: true }) // Each item in the array should be a string (course IDs)
  Teach_Courses: string[];

  @IsOptional() // Profile picture URL is optional
  @IsString()
  profilePictureUrl?: string;
}
