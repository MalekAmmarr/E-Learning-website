import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Logs,LogsSchema } from 'src/schemas/logs.schema';
import { LogsModule } from '../logs/logs.module';
import { LogsService } from '../logs/logs.service';
import { LogsController } from '../logs/logs.controller';
import { Progress, ProgressSchema } from 'src/schemas/progress.schema';
import { CoursesModule } from '../courses/courses.module';
import { Course, CourseSchema } from 'src/schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        {name:Logs.name,schema:LogsSchema},
        {name: Progress.name, schema: ProgressSchema},
        { name: Course.name, schema: CourseSchema }
      ],
      'eLearningDB',
    ),
    LogsModule,CoursesModule
  ],
  controllers: [UsersController],
  providers: [UsersService,LogsService],
  exports: [MongooseModule],
})
export class UsersModule {}
