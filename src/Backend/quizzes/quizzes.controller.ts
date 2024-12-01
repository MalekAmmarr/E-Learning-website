import { Body, Controller, Post, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from 'src/schemas/quiz.schema';
import { User } from 'src/schemas/user.schema';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizService: QuizzesService,
  ) {}

 /* @Post(':quizId/start')
async startQuiz(
  @Param('quizId') quizId: string,
  @Body('studentId') studentId: Types.ObjectId,
) {
  await this.quizService.startQuiz(quizId, studentId);
  return { message: 'Quiz started' };
}


@Get(':quizId/next')
async getNextQuestion(
  @Param('quizId') quizId: string,
  @Query('studentId') studentId: Types.ObjectId,
) {
  const nextQuestion = await this.quizService.getNextQuestion(quizId, studentId);
  return nextQuestion;
}


@Post(':quizId/answer')
async submitAnswer(
  @Param('quizId') quizId: string,
  @Body() body: { studentId: Types.ObjectId; questionId: string; answer: string },
) {
  const isCorrect = await this.quizService.submitAnswer(body.studentId, body.questionId, body.answer);
  return { isCorrect };
}

@Get(':quizId/results')
async getResults(
  @Param('quizId') quizId: string,
  @Query('studentId') studentId: Types.ObjectId,
) {
  const results = await this.quizService.getResults(quizId, studentId);
  return results;
}*/

}
