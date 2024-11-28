import { Module } from '@nestjs/common';
import { EnrollementController } from './enrollement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from '../schemas/enrollement.schema';
import { EnrollementService } from './enrollement.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }], 'eLearningDB'),
  ],
  controllers: [EnrollementController],
  providers:[EnrollementService]
})
export class EnrollementModule {}
