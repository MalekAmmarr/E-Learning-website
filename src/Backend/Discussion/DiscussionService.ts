// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import mongoose, { Model } from 'mongoose';
// import { Thread } from 'src/schemas/threads.schema';
// import { Reply } from 'src/schemas/reply.schema';
// import { Announcement } from 'src/schemas/announcement.schema';
// import { Forum } from 'src/schemas/forum.schema';

// @Injectable()
// export class DiscussionService {
//   constructor(
//     @InjectModel(Thread.name, "eLearningDB") private readonly threadModel: mongoose.Model<Thread>,
//     @InjectModel(Reply.name, "eLearningDB") private readonly replyModel: mongoose.Model<Reply>,
//     @InjectModel(Announcement.name, "eLearningDB") private readonly announcementModel: mongoose.Model<Announcement>,
//     @InjectModel(Forum.name, "eLearningDB") private readonly forumModel: mongoose.Model<Forum>
//   ) {}

//   //Create Forum
//   async createForum(courseId: string, createdBy: string){
//     const existingForum = await this.forumModel.findOne({courseId});
//     if(existingForum){
//       throw new Error('Group ID already exists.');
//     }

//     const newForum = new this.forumModel({courseId, createdBy});

//     return await newForum.save();

    
//   }
//   async deleteForumWithThreadsAndReplies(courseId: string) {
//     try {
//       // Fetch all threads associated with the forum
//       const threads = await this.threadModel.find({ courseId }).exec();
  
//       // Extract thread IDs
//       const threadIds = threads.map(thread => thread._id);
  
//       // Delete all replies associated with the threads
//       await this.replyModel.deleteMany({ threadId: { $in: threadIds } }).exec();
  
//       // Delete all threads associated with the forum
//       await this.threadModel.deleteMany({ courseId }).exec();
  
//       // Finally, delete the forum
//       const forum = await this.threadModel.findOne({ courseId }).exec();
//       await this.forumModel.findByIdAndDelete(forum._id).exec();
//     } catch (error) {
//       throw new Error(`Error deleting forum and its associated data: ${error.message}`);
//     }
//   }
//   //get forum by courseId
//   async getForumByCourseId(courseId: string) {
//     try {
//       return this.threadModel.findOne({ courseId }).exec();
//     } catch (error) {
//       throw new Error(`Error retrieving forum by courseId: ${error.message}`);
//     }
//   }
//   //get forum by id
//   async getForumById(forumId: string) {
//     try {
//       const forum = await this.forumModel.findById(forumId).exec();
//       if (!forum) {
//         throw new Error('Forum not found.');
//       }
//       return forum;
//     } catch (error) {
//       throw new Error(`Error retrieving forum: ${error.message}`);
//     }
//   }

 
//   // Get all threads for a course
//   async getThreadsByForum(forumId: string) {
//     return this.threadModel.find({ forumId }).sort({ createdAt: -1 }).exec();
//   }

//   // Get all replies for a thread
//   async getRepliesForThread(threadId: string) {
//     return this.replyModel.find({ threadId }).sort({ createdAt: 1 }).exec();
//   }

//   // Search threads by title or content
//   async searchThreads(query: string) {
//     return this.threadModel.find({ $text: { $search: query } }).exec();
//   }
//   // Save Announcement
//   async saveAnnouncement(courseId: string, title: string, content: string, createdBy: string) {
//     const announcement = new this.announcementModel({
//       courseId,
//       title,
//       content,
//       createdBy,
//       createdAt: new Date(),
//     });
//     return announcement.save();
//   }
//   async getAnnouncementsByCourse(courseId: string) {
//     return this.threadModel.find({ courseId }).sort({ createdAt: -1 }).exec();
//   }

//   async saveReply( threadId: string, content: string, createdBy: string) {
//     const reply = new this.replyModel({
      
//       threadId,
//       content,
//       createdBy,
//       createdAt: new Date(),
//     });
//     return reply.save();
//   }
//   async saveThread(courseId: string, title: string, content: string, createdBy: string) {
//     const thread = new this.threadModel({
//       courseId,
//       title,
//       content,
//       createdBy,
//       createdAt: new Date(),
//     });
//     return thread.save();
//   }
//   async getThreadbyId(threadId: string){
//     const thread = await this.threadModel.findById( threadId ).exec();
//     return thread;
//   }
//   async getReplybyId(replyId: string){
//     const reply = await this.replyModel.findOne({ _id: replyId }).exec();
//     return reply;
//   }
//   // Update a Thread
//   async updateThread(threadId: string, title: string, content: string) {
//     const updatedThread = await this.threadModel.findByIdAndUpdate(
//       threadId,
//       { title, content, updatedAt: new Date() },
//       { new: true },
//     );
//     return updatedThread;
//   }

//   async deleteThread(threadId: string) {
//     try {
//       // Delete all replies associated with the thread
//       await this.replyModel.deleteMany({ threadId }).exec();
  
//       // Delete the thread itself
//       return this.threadModel.findByIdAndDelete(threadId).exec();
//     } catch (error) {
//       throw new Error(`Error deleting thread and its associated replies: ${error.message}`);
//     }
//   }
//   async deleteReply(replyId: string) {
//     return this.replyModel.findByIdAndDelete(replyId).exec();
//   }
 
  
    
 
// }
