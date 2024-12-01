import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from 'src/schemas/quiz.schema';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
//import { UsersModule } from '../users/users.module';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Quiz.name, schema: QuizSchema },{ name: User.name, schema: UserSchema }],
      'eLearningDB',
    ),//UsersModule
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
