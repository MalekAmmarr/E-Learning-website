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
import { CreateQuizDto } from './dto/create-quiz.dto';
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
  @UseGuards(AuthorizationGuard)
  @Post()
  @Roles('instructor')
  async createQuiz(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizDto);
  }

  // Route to update an existing quiz
  @UseGuards(AuthorizationGuard)
  @Put(':quizId')
  @Roles('instructor')
  async updateQuiz(
    @Param('quizId') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    return this.quizService.updateQuiz(quizId, updateQuizDto);
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
    }: {
      quizId: string;
      email: string;
      answers: string[];
    },
  ) {
    return this.quizService.submitAnswers(email, quizId, answers);
  }

  // Endpoint to grade a quiz and update user score
  @UseGuards(AuthorizationGuard)
  @Patch(':quizId/grade')
  @Roles('student')
  async gradeQuiz(
    @Param('quizId') quizId: string,
    @Body('studentEmail') studentEmail: string,
    @Body('studentAnswers') studentAnswers: string[],
    @Body('feedback') feedback: string[],
  ) {
    return this.quizService.gradeQuiz(
      quizId,
      studentEmail,
      studentAnswers,
      feedback,
    );
  }
}
