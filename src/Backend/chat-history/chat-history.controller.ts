import { ChatHistoryService } from 'src/Backend/chat-history/chat-history.service';
import { ChatHistory } from 'src/schemas/chathistory.schema';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProgressService } from 'src/Backend/progress/progress.service';

import { Roles } from '../auth/decorators/roles.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  // Endpoint for an instructor to get a student's progress by email
  // @UseGuards(AuthorizationGuard)
  @Post('Create')
  //@Roles('instructor', 'student')
  async getStudentProgress(@Body() createGroupDto: CreateGroupDto) {
    return this.chatHistoryService.CreateGroup(createGroupDto);
  }
  @Get('getGroups/:Admin/:title')
  //@Roles('instructor', 'student')
  async getStudentGroups(
    @Param('Admin') Admin: string,
    @Param('title') title: string,
  ) {
    return this.chatHistoryService.getGroups(Admin, title);
  }
  @Get('getGroupChat/:Admin/:title')
  //@Roles('instructor', 'student')
  async getStudentGroupChat(
    @Param('Admin') Admin: string,
    @Param('title') title: string,
  ) {
    return this.chatHistoryService.getGroupChat(Admin, title);
  }

  @Post('sendMessage')
  //@Roles('instructor', 'student')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Body('CourseTitle') CourseTitle: string,
    @Body('Title') Title: string,
  ) {
    return this.chatHistoryService.sendMessage(
      sendMessageDto,

      CourseTitle,
      Title,
    );
  }

  @Post('create-discussion')
  async createGroupChat(
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.chatHistoryService.CreateGroupsDiscussions(createGroupDto);
  }

  @Get('get-discussion')
  async getGroupChat(
    @Query('Title') Title: string,
    @Query('CourseTitle') CourseTitle: string,
  ): Promise<ChatHistory | null> {
    return this.chatHistoryService.getGroupChatByTitleAndCourse(Title, CourseTitle);
  }

  // @Get('/getProgress/:CourseTitle/:studentEmail')
  // async getProgress(
  //   @Param('CourseTitle') CourseTitle: string,
  //   @Param('studentEmail') studentEmail: string,
  // ) {
  //   return this.progressService.getProgress(CourseTitle, studentEmail);
  // }
}
