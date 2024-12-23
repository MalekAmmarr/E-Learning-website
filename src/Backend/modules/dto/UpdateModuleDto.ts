import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsEnum(['MCQ', 'True/False'])
  @IsOptional()
  questionType?: 'MCQ' | 'True/False';

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsEnum(['easy', 'medium', 'hard'])
  @IsOptional()
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class UpdateModuleDto {
  @IsString()
  @IsOptional()
  courseTitle?: string;

  @IsEnum(['Small', 'Midterm', 'Final'])
  @IsOptional()
  quizType?: string;

  @IsString()
  @IsOptional()
  instructorEmail?: string;

  @IsEnum(['MCQ', 'True/False', 'Both'])
  @IsOptional()
  questionTypes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];
}
