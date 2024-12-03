import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  quizId: string; // Unique ID for the quiz

  @IsNotEmpty()
  @IsEnum(['Small', 'Midterm', 'Final'])
  quizType: string; // Type of quiz (Small, Midterm, or Final)

  @IsNotEmpty()
  @IsString()
  courseTitle: string; // Associated course title

  @IsNotEmpty()
  @IsString()
  instructorEmail: string; // Instructor's email who created the quiz

  @IsNotEmpty()
  @IsArray()
  questions: Array<{ question: string; options: string[]; correctAnswer: string }>; // Questions and answers

  @IsArray()
  studentAnswers?: string[]; // Optional field: student answers (initially empty)

  @IsNotEmpty()
  studentGrade?: number; // Optional: default grade, can be set after quiz is taken
}
