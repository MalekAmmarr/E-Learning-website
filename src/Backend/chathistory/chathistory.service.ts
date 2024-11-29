import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from 'src/schemas/chathistory.schema';

@Injectable()
export class ChathistoryService {
  constructor(@InjectModel(ChatHistory.name,'dataManagementDB') private chatModel: Model<ChatHistory>) {}

  async saveMessage(messageData: Partial<ChatHistory>): Promise<ChatHistory> {
    const message = new this.chatModel(messageData);
    return message.save();
  }

  async getMessagesBetweenUsers(user1: string, user2: string): Promise<ChatHistory[]> {
    return this.chatModel
      .find({
        $or: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      })
      .sort({ timestamp: 1 })
      .exec();
  }
}
