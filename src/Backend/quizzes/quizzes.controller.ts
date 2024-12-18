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
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from 'src/schemas/quiz.schema';
import { User } from 'src/schemas/user.schema';
import { QuizzesService } from './quizzes.service';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateQuizDto } from './dto/create-quiz.dto';
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
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    const {
      instructorEmail,
      quizId,
      quizType,
      numberOfQuestions,

      studentEmail,
      courseTitle,
    } = createQuizDto;

    try {
      // Call the service to create the quiz
      const createdQuiz = await this.quizService.createQuiz(
        instructorEmail,
        quizId,
        quizType,
        numberOfQuestions,
        studentEmail,
        courseTitle,
      );
      return { success: true, data: createdQuiz };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
  ) {
    console.log(email, courseTitle, quizId);
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
  @Patch('feedback')
  @Roles('instructor')
  async giveFeedback(
    @Body('quizId') quizId: string,
    @Body('studentEmail') studentEmail: string,
    @Body('feedback') feedback: string[],
  ) {
    return this.quizService.giveFeedback(quizId, studentEmail, feedback);
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

  @Get('instructor/by-instructor')
  async getQuizzesByInstructor(
    @Query('email') email: string,
  ): Promise<string[]> {
    if (!email) {
      throw new NotFoundException('Email is required');
    }

    return this.quizService.getQuizzesByInstructor(email);
  }

  @Get(':quizId/student-answers')
  async getStudentAnswers(@Param('quizId') quizId: string) {
    return this.quizService.getStudentAnswers(quizId);
  }

  @Get(':quizId/slecetedstudent-answers')
  async getselectedStudentAnswers(
    @Param('quizId') quizId: string,
    @Query('studentEmail') studentEmail: string, // Accept `studentEmail` as a query parameter
  ) {
    if (!studentEmail) {
      throw new BadRequestException('studentEmail query parameter is required');
    }
    return this.quizService.getselectedStudentAnswers(quizId, studentEmail);
  }
}
