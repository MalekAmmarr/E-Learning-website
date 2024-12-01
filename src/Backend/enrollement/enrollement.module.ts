import { Module } from '@nestjs/common';
import { EnrollementController } from './enrollement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollement, EnrollementSchema } from 'src/schemas/enrollement.schema';
import { EnrollementService } from './enrollement.service';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import {Notification, NotificationSchema } from 'src/schemas/notification.schema';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Enrollement.name, schema: EnrollementSchema },
        { name: Course.name, schema: CourseSchema },
        {name: Notification.name, schema: NotificationSchema}
      ],
      'eLearningDB',
    ),UsersModule
  ],
  controllers: [EnrollementController],
  providers: [EnrollementService],
})
export class EnrollementModule {}
