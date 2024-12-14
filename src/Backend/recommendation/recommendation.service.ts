import { Injectable, NotFoundException } from '@nestjs/common';
import { Recommendation } from 'src/schemas/recommendation.schema';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Course } from 'src/schemas/course.schema';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(Recommendation.name, 'eLearningDB')
    private readonly recommendationModel: Model<Recommendation>,
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>,
    @InjectModel(Course.name, 'eLearningDB')
    private readonly courseModel: Model<Course>
  ) {}

  // Generate recommendations for a user by email
  async generateRecommendations(studentEmail: string): Promise<Recommendation[]> {
    const user = await this.userModel.findOne({ email: studentEmail });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Fetch all courses
    const courses = await this.courseModel.find();

    // Generate scores for each course based on user preferences
    const recommendations = courses.map((course) => {
      let score = 0;

      // Example scoring logic
      if (user.acceptedCourses.includes(course.category)) score += 10;
      if (course.difficultyLevel === 'Beginner' && user.GPA < 2.5) score += 5;
      if (course.difficultyLevel === 'Advanced' && user.GPA > 3.5) score += 10;

      return {
        StudentEmail: studentEmail,
        courseTitle: course.title,
        score,
      };
    });

    // Filter and save top recommendations
    const topRecommendations = recommendations
      .filter((rec) => rec.score > 5) // Only keep relevant recommendations
      .sort((a, b) => b.score - a.score) // Sort by score
      .slice(0, 5); // Limit to top 5

    const savedRecommendations = await Promise.all(
      topRecommendations.map((rec) =>
        this.recommendationModel.create({
          StudentEmail: rec.StudentEmail,
          courseTitle: rec.courseTitle,
          score: rec.score,
        }),
      ),
    );

    return savedRecommendations;
  }

  // Fetch recommendations for a user by email
  async getRecommendations(studentEmail: string): Promise<Recommendation[]> {
    return this.recommendationModel
      .find({ StudentEmail: studentEmail })
      .exec();
  }

  // Mark a recommendation as viewed by email and course title
  async markAsViewed(studentEmail: string, courseTitle: string): Promise<Recommendation> {
    const recommendation = await this.recommendationModel.findOneAndUpdate(
      { StudentEmail: studentEmail, courseTitle },
      { isViewed: true },
      { new: true },
    );
    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }
    return recommendation;
  }

  // Accept a recommendation by email and course title
  async acceptRecommendation(studentEmail: string, courseTitle: string): Promise<Recommendation> {
    const recommendation = await this.recommendationModel.findOneAndUpdate(
      { StudentEmail: studentEmail, courseTitle },
      { isAccepted: true },
      { new: true },
    );
    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }
    return recommendation;
  }
}
