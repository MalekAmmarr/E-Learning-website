import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from 'src/schemas/quiz.schema';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';
import { Module as CourseModule, ModuleSchema } from 'src/schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
      { name: Quiz.name, schema: QuizSchema },{ name: User.name, schema: UserSchema },
      { name: Instructor.name, schema: InstructorSchema },
      { name: User.name, schema: UserSchema },
      {name:Course.name , schema:CourseSchema},
      {name: CourseModule.name , schema: ModuleSchema},
    ],
      'eLearningDB',
    ),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
