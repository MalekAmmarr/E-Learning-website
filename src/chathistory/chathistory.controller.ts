import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ChatHistoryService } from './chathistory.service';
import { ChatHistory } from '../schemas/chathistory.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatHistoryService) {}

  @Post()
  async saveMessage(@Body() messageData: Partial<ChatHistory>): Promise<ChatHistory> {
    return this.chatService.saveMessage(messageData);
  }

  @Get()
  async getMessages(
    @Query('user1') user1: string,
    @Query('user2') user2: string
  ): Promise<ChatHistory[]> {
    return this.chatService.getMessagesBetweenUsers(user1, user2);
  }
}
