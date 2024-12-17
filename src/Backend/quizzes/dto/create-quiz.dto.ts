import { IsArray, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  instructorEmail: string;

  @IsString()
  quizId: string;

  @IsString()
  quizType: string;

  @IsNumber()
  numberOfQuestions: number;

  @IsString()
  studentEmail: string;

  @IsString()
  courseTitle: string;
}