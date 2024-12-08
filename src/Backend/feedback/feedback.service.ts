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
}
