import { forwardRef, Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InstructorService } from './instructor.service';
import { Instructor, InstructorSchema } from 'src/schemas/Instructor.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { User } from 'src/schemas/User.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Instructor.name, schema: InstructorSchema },
        { name: User.name, schema: UserSchema },
        { name: Course.name, schema: CourseSchema}
      ],
      'eLearningDB',
    ),
    forwardRef(() => AuthModule), // Import AuthModule for authentication services
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
})
export class InstructorModule {}
