// thread.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread } from 'src/schemas/threads.schema';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
@Injectable()
export class ThreadService {
  constructor(@InjectModel(Thread.name, 'eLearningDB') private readonly threadModel: Model<Thread>) {}

  async createThread(createThreadDto: CreateThreadDto): Promise<Thread> {
    const thread = new this.threadModel(createThreadDto);
    return thread.save();
  }

  async getThreadsByForum(forumId: string): Promise<Thread[]> {
    return this.threadModel.find({ forumId }).exec();
  }
  async updateThread(threadId: string, updateThreadDto: UpdateThreadDto): Promise<Thread> {
    return this.threadModel.findByIdAndUpdate(threadId, updateThreadDto, { new: true }).exec();
  }

  async deleteThread(threadId: string, userId: string): Promise<void> {
    await this.threadModel.findOneAndDelete({ _id: threadId, $or: [{ createdBy: userId }] }).exec();
  }
}