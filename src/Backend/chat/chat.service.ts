import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Message } from 'src/schemas/message.schema';
import { Group } from 'src/schemas/group.schema';
import { User } from 'src/schemas/user.schema';
import { Instructor } from 'src/schemas/instructor.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name,'eLearningDB') private readonly messageModel:mongoose.Model<Message>,
    @InjectModel(Group.name,'eLearningDB') private readonly groupModel:mongoose.Model<Group>,
    @InjectModel(User.name,'eLearningDB') private readonly userModel: mongoose.Model<User>,
    @InjectModel(Instructor.name,'eLearningDB') private readonly instructorModel: mongoose.Model<Instructor>
  ) {}

  async saveMessage(courseId: string, userId: string, senderName: string, content: string): Promise<Message> {
    const message = new this.messageModel({ courseId, userId, senderName, content });
    return await message.save();
  }

  async getMessagesHistory(courseId: string): Promise<Message[]> {
    return await this.messageModel.find({ courseId }).populate('userId', 'name').exec();
  }

  async findGroupById(courseId: string) {
    return await this.groupModel.findById(courseId).exec();
  }

  async addUserToGroup(groupId: string, userId: string) {
    return await this.groupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );
  }

  async getGroupMessages(groupId: string): Promise<Message[]> {
    return await this.messageModel.find({ groupId }).exec();
  }

  async findParticipantById(userId: string): Promise<User | Instructor | null> {
    const user = await this.userModel.findById(userId).exec();
    if (user) return user;

    const instructor = await this.instructorModel.findById(userId).exec();
    return instructor || null;
  }

  // async savePrivateMessage(roomId: string, senderId: string, senderName: string, content: string): Promise<Message> {
  //   const message = new this.messageModel({ roomId, senderId, senderName, content });
  //   return await message.save();
  // }
  
  // async getPrivateMessages(roomId: string): Promise<Message[]> {
  //   return await this.messageModel.find({ roomId }).sort({ createdAt: 1 }).exec(); // Sort by creation time
  // }

  async createGroup(groupData: {
    name: string;
    groupId: string;
    members: string[];
    courseId: string;
  }) {
    const { name, groupId, members, courseId} = groupData;
  
    // Check if a group with the same ID already exists
    const existingGroup = await this.groupModel.findOne({ groupId });
    if (existingGroup) {
      throw new Error('Group ID already exists.');
    }
  
    // Create the new group
    const newGroup = new this.groupModel({
      name,
      groupId,
      members,
      courseId,
      createdAt: new Date(),
    });
  
    return await newGroup.save();
  }
  
  
}
