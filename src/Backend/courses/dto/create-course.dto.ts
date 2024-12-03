import { IsString, IsInt, IsEnum, IsArray, IsOptional, IsEmail } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsOptional()
  courseId?: string;  // Optionally, let the system generate this ID

  @IsString()
  title: string;

  @IsEmail()
  instructormail: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  difficultyLevel: string;

  @IsInt()
  totalClasses: number;

  @IsArray()
  @IsOptional()
  courseContent: string[]; // Array of PDF URLs/paths
}
