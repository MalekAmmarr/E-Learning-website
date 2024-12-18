import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread } from 'src/schemas/threads.schema';
import { Reply } from 'src/schemas/reply.schema';
import { Announcement } from 'src/schemas/announcement.schema';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<Thread>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
    @InjectModel(Announcement.name) private announcementModel: Model<Announcement>,
  ) {}

  // Create a new thread
  async createThread(courseId: string, title: string, content: string, createdBy: string) {
    const newThread = new this.threadModel({ courseId, title, content, createdBy });
    return newThread.save();
  }

  // Create a new reply to a thread
  async createReply(threadId: string, content: string, createdBy: string) {
    const newReply = new this.replyModel({ threadId, content, createdBy });
    return newReply.save();
  }

  // Get all threads for a course
  async getThreadsByCourse(courseId: string) {
    return this.threadModel.find({ courseId }).sort({ createdAt: -1 }).exec();
  }

  // Get all replies for a thread
  async getRepliesForThread(threadId: string) {
    return this.replyModel.find({ threadId }).sort({ createdAt: 1 }).exec();
  }

  // Search threads by title or content
  async searchThreads(query: string) {
    return this.threadModel.find({ $text: { $search: query } }).exec();
  }
  // Save Announcement
  async saveAnnouncement(courseId: string, title: string, content: string, createdBy: string) {
    const announcement = new this.announcementModel({
      title,
      content,
      createdAt: new Date(),
    });
    return announcement.save();
  }
 
}
