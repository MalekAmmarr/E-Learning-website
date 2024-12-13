import { forwardRef, Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InstructorService } from './instructor.service';
import { Instructor, InstructorSchema } from 'src/schemas/Instructor.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { User } from 'src/schemas/User.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { AuthModule } from '../auth/auth.module';
import { LogsService } from '../logs/logs.service';
import { Logs, LogsSchema } from 'src/schemas/logs.schema';
import { LogsModule } from '../logs/logs.module';
import { Feedback, FeedbackSchema } from 'src/schemas/feedback.schema';
import { FeedbackService } from '../feedback/feedback.service';
import { Progress, ProgressSchema } from 'src/schemas/progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Instructor.name, schema: InstructorSchema },
        { name: User.name, schema: UserSchema },
        { name: Course.name, schema: CourseSchema },
        { name: Logs.name, schema: LogsSchema },
        { name: Feedback.name, schema: FeedbackSchema },
        {name: Progress.name, schema: ProgressSchema}
      ],
      'eLearningDB',
    ),
    forwardRef(() => AuthModule), // Import AuthModule for authentication services
  ],
  controllers: [InstructorController],
  providers: [InstructorService, LogsService, FeedbackService],
})
export class InstructorModule { }
