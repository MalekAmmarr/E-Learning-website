import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserInteraction,
  UserInteractionSchema,
} from 'src/schemas/interaction.schema';

@Injectable()
export class InteractionService {
  constructor(
    @InjectModel(UserInteraction.name, 'eLearningDB')
    private readonly userinteractionModel: Model<UserInteraction>,
  ) {}
}
