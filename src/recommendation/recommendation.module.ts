import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recommendation, RecommendationSchema } from '../schemas/recommendation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recommendation.name, schema: RecommendationSchema }], 'eLearningDB'),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService]
})
export class RecommendationModule {}
