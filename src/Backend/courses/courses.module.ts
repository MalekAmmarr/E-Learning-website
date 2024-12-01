import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Course.name, schema: CourseSchema }],
      'eLearningDB',
    ),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
