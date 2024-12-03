import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  difficultyLevel?: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @IsNumber()
  totalClasses?: number;

  @IsOptional()
  @IsString({ each: true })
  courseContent?: string[]; // We will not use this field when updating
}
