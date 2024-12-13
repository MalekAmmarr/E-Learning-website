import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  numberOfQuestions: number; // Number of questions the instructor wants to generate


  @IsArray()
  studentAnswers?: string[]; // Optional field: student answers (initially empty)

  @IsNumber()
  studentScore?: number; // Student's score (for Midterm or Final quiz)

  
}
