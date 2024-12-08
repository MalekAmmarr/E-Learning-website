import { Body, Controller, Post, Get, Param, Query, NotFoundException, Put, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from 'src/schemas/quiz.schema';
import { User } from 'src/schemas/user.schema';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizService: QuizzesService,
  ) {}

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
    @Body() updateQuizDto: UpdateQuizDto
  ): Promise<Quiz> {
    return this.quizService.updateQuiz(quizId, updateQuizDto);
  }


   // Start the quiz for a student
   @UseGuards(AuthorizationGuard)
   @Post('start/:quizId/:courseTitle')
   @Roles('student')
   async startQuiz(
     @Param('quizId') quizId: string,
     @Param('courseTitle') courseTitle: string,
     @Body('email') email: string
   ) {
     return this.quizService.startQuiz(email, quizId, courseTitle);
   }
 
   // Submit answers from the student
   @UseGuards(AuthorizationGuard)
   @Post('submit/:quizId')
   @Roles('student')
   async submitAnswers(
     @Param('quizId') quizId: string,
     @Body('email') email: string,
     @Body('answers') answers: string[]
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
    return this.quizService.gradeQuiz(quizId, studentEmail, studentAnswers, feedback);
  }

}
