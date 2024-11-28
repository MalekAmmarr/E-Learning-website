import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from'mongoose';
import { Feedback, FeedbackSchema } from 'src/schemas/feedback.schema';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback.name, 'eLearningDB') private readonly feedbackModel: Model<Feedback>) {}
}
