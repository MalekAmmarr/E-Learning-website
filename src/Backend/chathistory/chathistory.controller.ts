import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ChathistoryService } from './chathistory.service';
import { ChatHistory } from 'src/schemas/chathistory.schema';

@Controller('chathistory')
export class ChathistoryController {
  constructor(private readonly chatService: ChathistoryService) {}

  @Post()
  async saveMessage(
    @Body() messageData: Partial<ChatHistory>,
  ): Promise<ChatHistory> {
    return this.chatService.saveMessage(messageData);
  }

  @Get()
  async getMessages(
    @Query('user1') user1: string,
    @Query('user2') user2: string,
  ): Promise<ChatHistory[]> {
    return this.chatService.getMessagesBetweenUsers(user1, user2);
  }
}
