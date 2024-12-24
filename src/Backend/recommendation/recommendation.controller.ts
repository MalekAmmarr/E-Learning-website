import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Recommendation } from 'src/schemas/recommendation.schema';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {

    constructor(private readonly recommendationService: RecommendationService) {}



    @Post('generate/:email')
  async generateRecommendations(
    @Param('email') email: string,
  ): Promise<Recommendation[]> {
    return this.recommendationService.generateRecommendations(email);
  }

   // Fetch recommendations by user email
   @Get('fetch-by-email/:email')
   async fetchRecommendationsByEmail(
     @Param('email') email: string,
   ): Promise<Recommendation[]> {
     return this.recommendationService.fetchRecommendationsByEmail(email);
   }

  // Mark a recommendation as viewed by email and course title
  @Patch('view/:studentEmail/:courseTitle')
  async markAsViewed(
    @Param('studentEmail') studentEmail: string,
    @Param('courseTitle') courseTitle: string,
  ): Promise<Recommendation> {
    return this.recommendationService.markAsViewed(studentEmail, courseTitle);
  }

  // Accept a recommendation by email and course title
  @Patch('accept/:studentEmail/:courseTitle')
  async acceptRecommendation(
    @Param('studentEmail') studentEmail: string,
    @Param('courseTitle') courseTitle: string,
  ): Promise<Recommendation> {
    return this.recommendationService.acceptRecommendation(studentEmail, courseTitle);
  }


  
}

