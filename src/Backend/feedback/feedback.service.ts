import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackSchema } from 'src/schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name, 'eLearningDB')
    private readonly feedbackModel: Model<Feedback>,
  ) { }

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    return createdFeedback.save();
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.find().exec();
  }

  async findByEmail(studentemail: string): Promise<Feedback[]> {
    return this.feedbackModel.find({ studentemail }).exec();
  }


  async deleteAllFeedbacks(): Promise<{ message: string }> {
    await this.feedbackModel.deleteMany({}); // Deletes all feedbacks in the collection
    return { message: 'All feedbacks deleted successfully' };
  }
  async deleteFeedbacksByEmail(studentemail: string): Promise<{ message: string }> {
    const result = await this.feedbackModel.deleteMany({ studentemail });

    if (result.deletedCount === 0) {
      return { message: `No feedbacks found for the user with email: ${studentemail}` };
    }

    return { message: `${result.deletedCount} feedback(s) deleted for ${studentemail}` };
  }
}
