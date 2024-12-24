import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reply } from 'src/schemas/reply.schema';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Thread } from 'src/schemas/threads.schema';

@Injectable()
export class ReplyService {
  constructor(@InjectModel(Reply.name, 'eLearningDB') private readonly replyModel: Model<Reply>,
  @InjectModel(Thread.name, 'eLearningDB') private readonly threadModel: Model<Thread>,
) {}


async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
  
  const reply = await new this.replyModel(createReplyDto).save();


  await this.threadModel.findByIdAndUpdate(
    reply.threadId,
    { $addToSet: { replyIds: reply._id } }, 
    { new: true },
  );

  return reply;
}

  async getRepliesByThread(threadId: string): Promise<Reply[]> {
    return this.replyModel.find({ threadId }).exec();
  }
  async updateReply(replyId: string, updateReplyDto: UpdateReplyDto): Promise<Reply> {
    return this.replyModel.findByIdAndUpdate(replyId, updateReplyDto, { new: true }).exec();
  }

  async deleteReply(replyId: string, userId: string): Promise<void> {
    await this.replyModel.findOneAndDelete({ _id: replyId, $or: [{ createdBy: userId }] }).exec();
  }
}