import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ChathistoryService } from './chathistory.service';
import { ChatHistory } from 'src/schemas/chathistory.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';

@Controller('chathistory')
export class ChathistoryController {
  constructor(private readonly chatService: ChathistoryService) {}

  @Post()
  async saveMessage(
    @Body() messageData: Partial<ChatHistory>,
  ): Promise<ChatHistory> {
    return this.chatService.saveMessage(messageData);
  }

  @UseGuards(AuthorizationGuard)
  @Get()
  @Roles('admin', 'instructor') 
  async getMessages(
    @Query('user1') user1: string,
    @Query('user2') user2: string,
  ): Promise<ChatHistory[]> {
    return this.chatService.getMessagesBetweenUsers(user1, user2);
  }
}
