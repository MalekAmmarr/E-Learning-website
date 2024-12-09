import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Logs, LogsSchema } from 'src/schemas/logs.schema';
import { LogsModule } from '../logs/logs.module';
import { LogsService } from '../logs/logs.service';
import { LogsController } from '../logs/logs.controller';
import { Progress, ProgressSchema } from 'src/schemas/progress.schema';
import { CoursesModule } from '../courses/courses.module';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { AuthModule } from '../auth/auth.module';
import { Feedback, FeedbackSchema } from 'src/schemas/feedback.schema';
import { FeedbackService } from '../feedback/feedback.service';
import { Note, NoteSchema } from 'src/schemas/note.schema';
import { NotesService } from '../note/note.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Logs.name, schema: LogsSchema },
        { name: Progress.name, schema: ProgressSchema },
        { name: Course.name, schema: CourseSchema },
        { name: Feedback.name, schema: FeedbackSchema },
        {name:Note.name,schema:NoteSchema}
      ],
      'eLearningDB',
    ),
    LogsModule, CoursesModule,
    forwardRef(() => AuthModule), // Import AuthModule for authentication services

  ],
  controllers: [UsersController],
  providers: [UsersService, LogsService, FeedbackService,NotesService],
  exports: [MongooseModule,UsersService],
})
export class UsersModule { }
