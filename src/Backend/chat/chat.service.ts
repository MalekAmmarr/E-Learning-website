import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Instructor } from "src/schemas/instructor.schema";
import { User } from "src/schemas/user.schema";
import { ChatMessage } from "src/schemas/message.schema";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name, 'eLearningDB') private messageModel:mongoose.Model<ChatMessage>
  ) {}

  async saveMessage(room: string, user: string, message: string) {
    const newMessage = new this.messageModel({ room:room, user:user, message:message, createdAt: new Date() });
    return await newMessage.save();
  }

  async getMessagesHistory(room: string) {
    return this.messageModel.find({ room }).sort({ createdAt: 1 }).exec();
  }
}





// private rooms: { [room: string]: { users: string[]; messages: { user: string; text: string }[] } } = {};

  // createRoom(room: string) {
  //   if (!this.rooms[room]) {
  //     this.rooms[room] = { users: [], messages: [] };
  //   }
  // }

  // joinRoom(room: string, user: string) {
  //   this.createRoom(room);
  //   if (!this.rooms[room].users.includes(user)) {
  //     this.rooms[room].users.push(user);
  //   }
  // }

  // leaveRoom(room: string, user: string) {
  //   if (this.rooms[room]) {
  //     this.rooms[room].users = this.rooms[room].users.filter((u) => u !== user);
  //   }
  // }

  // // saveMessage(room: string, user: string, message: string) {
  // //   this.createRoom(room);
  // //   this.rooms[room].messages.push({ user, text: message });
  // //   return { room, user, message };
  // // }

  // getRoomMessages(room: string) {
  //   return this.rooms[room]?.messages || [];
  // }
