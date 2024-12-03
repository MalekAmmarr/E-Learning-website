import { Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InstructorService } from './instructor.service';
import { Instructor, InstructorSchema } from 'src/schemas/Instructor.schema';
import { AuthenticationLogModule } from '../authentication-log/authentication-log.module';
import { UserSchema } from 'src/schemas/user.schema';
import { User } from 'src/schemas/User.schema';
import { Logs, LogsSchema } from 'src/schemas/logs.schema';
import { LogsController } from '../logs/logs.controller';
import { LogsService } from '../logs/logs.service';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Instructor.name, schema: InstructorSchema },
        { name: User.name, schema: UserSchema },
        {name:Logs.name,schema:LogsSchema}
      ],
      'eLearningDB',
    ),
    AuthenticationLogModule,
    LogsModule,
  ],
  controllers: [InstructorController],
  providers: [InstructorService,LogsService],
})
export class InstructorModule {}
