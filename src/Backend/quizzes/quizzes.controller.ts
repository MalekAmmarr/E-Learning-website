import { Body, Controller, Post, Get, Param, Query, NotFoundException, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from 'src/schemas/quiz.schema';
import { User } from 'src/schemas/user.schema';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizService: QuizzesService,
  ) {}

  // Route to create a new quiz
  @Post()
  async createQuiz(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizDto);
  }

  // Route to update an existing quiz
  @Put(':quizId')
  async updateQuiz(
    @Param('quizId') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto
  ): Promise<Quiz> {
    return this.quizService.updateQuiz(quizId, updateQuizDto);
  }


   // Start the quiz for a student
   @Post('start/:quizId/:courseTitle')
   async startQuiz(
     @Param('quizId') quizId: string,
     @Param('courseTitle') courseTitle: string,
     @Body('email') email: string
   ) {
     return this.quizService.startQuiz(email, quizId, courseTitle);
   }
 
   // Submit answers from the student
   @Post('submit/:quizId')
   async submitAnswers(
     @Param('quizId') quizId: string,
     @Body('email') email: string,
     @Body('answers') answers: string[]
   ) {
     return this.quizService.submitAnswers(email, quizId, answers);
   }
 
   // Grade a quiz for a student
   @Post('grade/:quizId/:studentEmail')
   async gradeQuiz(
     @Param('quizId') quizId: string,
     @Param('studentEmail') studentEmail: string,
     @Body('instructorEmail') instructorEmail: string
   ) {
     return this.quizService.gradeQuiz(instructorEmail, quizId, studentEmail);
   }

}
