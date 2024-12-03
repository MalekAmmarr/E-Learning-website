import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Instructor, InstructorSchema } from 'src/schemas/Instructor.schema';
import { AuthenticationLogModule } from '../authentication-log/authentication-log.module';
import { UserSchema } from 'src/schemas/user.schema';
import { User } from 'src/schemas/User.schema';
import { admin, AdminSchema } from 'src/schemas/admin.schema';
import { CoursesService } from '../courses/courses.service';
import { CourseSchema , Course} from 'src/schemas/course.schema';

@Module({
  imports: [

  MongooseModule.forFeature(
    [
      {name: admin.name , schema:AdminSchema},
      { name: Instructor.name, schema: InstructorSchema },
      { name: User.name, schema: UserSchema },
      {name:Course.name , schema:CourseSchema}
    ],
    'eLearningDB',
  ),
  AuthenticationLogModule,
],
  controllers: [AdminsController],
  providers: [AdminsService, CoursesService],
})
export class AdminsModule {}
