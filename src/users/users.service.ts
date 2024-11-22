import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, 'eLearningDB') private readonly userModel: Model<User>) {}

  // Fetch all users
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
