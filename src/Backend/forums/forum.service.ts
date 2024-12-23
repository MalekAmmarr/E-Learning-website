import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum } from 'src/schemas/forum.schema';
import { CreateForumDto } from './dto/create-forum.dto';

@Injectable()
export class ForumService {
  constructor(@InjectModel(Forum.name, 'eLearningDB') private readonly forumModel: Model<Forum>) {}

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
    await this.forumModel.findOneAndDelete({ _id: forumId, instructorId }).exec();
  }
}
