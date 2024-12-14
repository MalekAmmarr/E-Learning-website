import { Recommendation } from 'src/schemas/recommendation.schema';
import { Model } from 'mongoose';
export declare class RecommendationService {
    private readonly userinteractionModel;
    constructor(userinteractionModel: Model<Recommendation>);
}
