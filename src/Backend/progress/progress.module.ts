import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Progress, ProgressSchema } from 'src/schemas/progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Progress.name, schema: ProgressSchema },
        { name: User.name, schema: UserSchema },
        { name: Course.name, schema: CourseSchema}
      ],
      'eLearningDB',
    ),
  ],
  controllers: [ProgressController],
  providers: [ProgressService]
})
export class ProgressModule {}
