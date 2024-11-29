import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from '../../schemas/progress.schema';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Progress.name, schema: ProgressSchema }],
      'eLearningDB',
    ),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
