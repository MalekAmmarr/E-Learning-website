import { Module } from '@nestjs/common';
import { EnrollementController } from './enrollement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollement, EnrollementSchema } from 'src/schemas/enrollement.schema';
import { EnrollementService } from './enrollement.service';
import { NotificationModule } from '../notification/notification.module'; // Import the NotificationModule


@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Enrollement.name, schema: EnrollementSchema }],
      'eLearningDB',
    ),NotificationModule,
  ],
  controllers: [EnrollementController],
  providers: [EnrollementService],
})
export class EnrollementModule {}
