import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum } from 'src/schemas/forum.schema';
import { CreateForumDto } from './dto/create-forum.dto';
import { Thread } from 'src/schemas/threads.schema';
import { Reply } from 'src/schemas/reply.schema';


@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Forum.name, 'eLearningDB') private readonly forumModel: Model<Forum>,
    @InjectModel(Thread.name, 'eLearningDB') private readonly threadModel: Model<Thread>,
    @InjectModel(Reply.name, 'eLearningDB') private readonly replyModel: Model<Reply>,
  ) {}

  async createForum(createForumDto: CreateForumDto): Promise<Forum> {
    const forum = new this.forumModel(createForumDto);
    return forum.save();
  }

  async getForumsByCourse(courseId: string): Promise<Forum[]> {
    return this.forumModel.find({ courseId }).exec();
  }

  async joinForum(forumId: string, studentId: string): Promise<Forum> {
    return this.forumModel.findByIdAndUpdate(
      forumId,
      { $addToSet: { studentIds: studentId } },
      { new: true },
    ).exec();
  }
  async deleteForum(forumId: string, instructorId: string): Promise<void> {
    const threads = await this.threadModel.find({ forumId }).exec();
    const threadIds = threads.map(thread => thread._id);
    await this.replyModel.deleteMany({ threadId: { $in: threadIds } }).exec();
    await this.threadModel.deleteMany({ forumId }).exec();
    await this.forumModel.findOneAndDelete({ _id: forumId, instructorId }).exec();
  }
}
