import { IsString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  question: string;

  @IsEnum(['MCQ', 'True/False'])
  questionType: 'MCQ' | 'True/False';

  @IsArray()
  options: string[];

  @IsString()
  correctAnswer: string;

  @IsEnum(['easy', 'medium', 'hard'])
  difficulty: 'easy' | 'medium' | 'hard';
}

export class CreateModuleDto {
  @IsString()
  quizId: string;

  @IsString()
  courseTitle: string;

  @IsEnum(['Small', 'Midterm', 'Final'])
  quizType: string;

  @IsString()
  instructorEmail: string;

  @IsEnum(['MCQ', 'True/False', 'Both'])
  questionTypes: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
