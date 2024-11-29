import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from 'src/schemas/quiz.schema';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }], 'eLearningDB'),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService]
})
export class QuizzesModule {}
