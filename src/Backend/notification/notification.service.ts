import { Injectable } from '@nestjs/common';
import { Notification } from 'src/schemas/notification.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name, 'eLearningDB')
    private readonly userinteractionModel: Model<Notification>,
  ) {}
}
