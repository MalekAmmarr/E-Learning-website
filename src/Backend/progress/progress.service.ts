import { Injectable } from '@nestjs/common';
import { Progress, ProgressSchema } from 'src/schemas/progress.schema';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from'mongoose';

@Injectable()
export class ProgressService {
    constructor(
        @InjectModel(Progress.name, 'eLearningDB') private readonly userinteractionModel: Model<Progress>) {}
}

