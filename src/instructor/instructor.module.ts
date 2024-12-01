import { Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/Backend/users/users.module';
import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';
import { CoursesModule } from 'src/Backend/courses/courses.module';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instructor.name, schema: InstructorSchema },  // Register Instructor model
      { name: User.name, schema: UserSchema },              // Register User model
      { name: Course.name, schema: CourseSchema },          // Register Course model
    ],'eLearningDB',),
  ],
  controllers: [InstructorController],
  providers: [InstructorService]
})
export class InstructorModule {}
