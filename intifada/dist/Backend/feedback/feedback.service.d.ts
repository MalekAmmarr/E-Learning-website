import { Model } from 'mongoose';
import { Feedback } from 'src/schemas/feedback.schema';
export declare class FeedbackService {
    private readonly feedbackModel;
    constructor(feedbackModel: Model<Feedback>);
}
