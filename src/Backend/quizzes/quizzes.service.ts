import { Injectable } from '@nestjs/common';
import { Quiz } from 'src/schemas/quiz.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name, 'eLearningDB')
    private readonly userinteractionModel: Model<Quiz>,
  ) {}
}
