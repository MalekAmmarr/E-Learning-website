// thread.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread } from 'src/schemas/threads.schema';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Reply } from 'src/schemas/reply.schema';

import { Forum } from 'src/schemas/forum.schema';
import { Instructor } from 'src/schemas/instructor.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name, 'eLearningDB') private readonly threadModel: Model<Thread>,
    @InjectModel(Reply.name, 'eLearningDB') private readonly replyModel: Model<Reply>,
    // @InjectModel(Forum.name, 'eLearningDB') private readonly ForumModel: Model<Forum>,
    // @InjectModel(Instructor.name, 'eLearningDB') private readonly InstructorModel: Model<Instructor>,
    // @InjectModel(User.name, 'eLearningDB') private readonly UserModel: Model<User>
  ) {}

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
    await this.replyModel.deleteMany({ threadId }).exec();
    await this.threadModel.findOneAndDelete({
      _id: threadId,
      $or: [{ createdBy: userId }],
    }).exec();
  }
  
}