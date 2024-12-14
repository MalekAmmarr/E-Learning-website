import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recommendation, RecommendationSchema } from 'src/schemas/recommendation.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Recommendation.name, schema: RecommendationSchema },
        { name: User.name, schema: UserSchema },
        { name: Course.name, schema: CourseSchema }
      ],
      'eLearningDB',
    ),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
