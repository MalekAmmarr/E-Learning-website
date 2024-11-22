import { Injectable } from '@nestjs/common';
import { Recommendation } from 'src/schemas/recommendation.schema';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from'mongoose';

@Injectable()
export class RecommendationService {
    constructor(
        @InjectModel(Recommendation.name, 'eLearningDB') private readonly userinteractionModel: Model<Recommendation>) {}
}

