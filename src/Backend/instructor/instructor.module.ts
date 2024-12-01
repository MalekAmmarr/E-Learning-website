import { Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InstructorService } from './instructor.service';
import { Instructor, InstructorSchema } from 'src/schemas/Instructor.schema';
import { AuthenticationLogModule } from '../authentication-log/authentication-log.module';
import { UserSchema } from 'src/schemas/user.schema';
import { User } from 'src/schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Instructor.name, schema: InstructorSchema },
        { name: User.name, schema: UserSchema },
      ],
      'eLearningDB',
    ),
    AuthenticationLogModule,
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
})
export class InstructorModule {}
