import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Message } from 'src/schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name,'eLearningDB') private readonly messageModel:mongoose.Model<Message>,
  ) {}

  async saveMessage(courseId: string, userId: string, senderName: string, content: string): Promise<Message> {
    const message = new this.messageModel({ courseId, userId, senderName, content });
    return await message.save();
  }

  async getMessagesHistory(courseId: string): Promise<Message[]> {
    return await this.messageModel.find({ courseId }).populate('userId', 'name').exec();
  }
}
