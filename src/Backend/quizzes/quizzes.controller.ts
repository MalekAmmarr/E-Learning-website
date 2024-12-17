import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  NotFoundException,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from 'src/schemas/quiz.schema';
import { User } from 'src/schemas/user.schema';
import { QuizzesService } from './quizzes.service';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
interface Question {
  question: string; // The question text
  options: string[]; // Array of options for the question
  correctAnswer: string; // The correct answer for the question
}

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizService: QuizzesService) {}

  // Route to create a new quiz
  //@UseGuards(AuthorizationGuard)
  @Post('create')
  //@Roles('instructor')
  async createQuiz(
    @Body('instructorEmail') instructorEmail: string,
    @Body('quizId') quizId: string,
    @Body('quizType') quizType: string,
    @Body('numberOfQuestions') numberOfQuestions: number,
  ) {
    return this.quizService.createQuiz(
      instructorEmail,
      quizId,
      quizType,
      numberOfQuestions,
    );
  }

  // Route to update an existing quiz
  //@UseGuards(AuthorizationGuard)
  @Put(':quizId')
  //@Roles('instructor')
  // Endpoint to update quiz content
  async updateQuiz(@Param('quizId') quizId: string, @Body() updateData: any) {
    return this.quizService.updateQuiz(quizId, updateData);
  }

  // Start the quiz for a student
  @UseGuards(AuthorizationGuard)
  @Post('startQuiz')
  @Roles('student')
  async startQuiz(
    @Body()
    {
      email,
      quizId,
      courseTitle,
    }: {
      quizId: string;
      email: string;
      courseTitle: string;
    },
  ): Promise<Question[]> {
    return this.quizService.startQuiz(email, quizId, courseTitle);
  }

  // Submit answers from the student
  @UseGuards(AuthorizationGuard)
  @Post('submitQuiz')
  @Roles('student')
  async submitAnswers(
    @Body()
    {
      email,
      quizId,
      answers,
      score,
      Coursetitle,
    }: {
      quizId: string;
      email: string;
      answers: string[];
      score: number;
      Coursetitle: string;
    },
  ): Promise<void> {
    return this.quizService.submitAnswers(
      email,
      quizId,
      answers,
      score,
      Coursetitle,
    );
  }

  // Endpoint to grade a quiz and update user score
  @UseGuards(AuthorizationGuard)
  @Patch('grade')
  @Roles('instructor')
  async gradeQuiz(
    @Body('quizId') quizId: string,
    @Body('studentEmail') studentEmail: string,
    @Body('feedback') feedback: string[],
  ) {
    return this.quizService.gradeQuiz(quizId, studentEmail, feedback);
  }

  @Get('by-course')
  async getQuizzesByCourseTitle(
    @Query('courseTitle') courseTitle: string,
  ): Promise<Quiz[]> {
    return this.quizService.getQuizzesByCourseTitle(courseTitle);
  }

  // Endpoint to fetch only quiz IDs by course title
  @Get('ids-by-course')
  async getQuizIdsByCourseTitle(
    @Query('courseTitle') courseTitle: string,
  ): Promise<string[]> {
    return this.quizService.getQuizIdsByCourseTitle(courseTitle);
  }

  // Endpoint to fetch the quiz content by quizId
  @Get(':quizId')
  async getQuizById(@Param('quizId') quizId: string): Promise<Quiz> {
    return this.quizService.getQuizById(quizId);
  }
}
