import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateQuizDto {
  @IsOptional()
  @IsEnum(['Small', 'Midterm', 'Final'])
  quizType?: string; // Type of quiz (Small, Midterm, or Final)

  @IsOptional()
  @IsString()
  courseTitle?: string; // Associated course title

  @IsOptional()
  @IsString()
  instructorEmail?: string; // Instructor's email

  @IsOptional()
  @IsArray()
  questions?: Array<{ question: string; options: string[]; correctAnswer: string }>; // Questions and answers

  @IsOptional()
  @IsArray()
  studentAnswers?: string[]; // Answers provided by the student

  @IsOptional()
  studentGrade?: number; // Grade after evaluation

  @IsOptional()
  isGraded?: boolean; // Whether the quiz has been graded
}
