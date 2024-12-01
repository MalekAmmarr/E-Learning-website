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
// Define the DTO for creating a User
export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  age: string; // Age is required and should be a string (or number if preferred)



  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsOptional() // Role is optional in the DTO since it's default in the schema
  @IsOptional() // Role is optional in the DTO since it's default in the schema
  @IsEnum(['student', 'instructor', 'admin'])
  role?: string; // Default is 'student' in the schema

  @IsOptional() // Profile picture URL is optional
  @IsString()
  profilePictureUrl?: string;

  @IsOptional() // Applied courses is an optional array of strings
  @IsArray()
  @IsString({ each: true }) // Each item in the array should be a string (course IDs)
  appliedCourses?: string[];

  @IsOptional() // Accepted courses is an optional array of strings
  @IsArray()
  @IsString({ each: true }) // Each item in the array should be a string (course IDs)
  acceptedCourses?: string[];

  @IsOptional() // Score is optional and defaults to 0
  @IsNumber()
  @IsPositive()
  score?: number; // Default is 0, but user can provide their own score
}