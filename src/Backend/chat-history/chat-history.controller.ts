import { ChatHistoryService } from 'src/Backend/chat-history/chat-history.service';
import { ChatHistory } from 'src/schemas/chathistory.schema';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  @Post('Create/:StudentOrInstructor')
  //@Roles('instructor', 'student')
  async getStudentProgress(
    @Body() createGroupDto: CreateGroupDto,
    @Param('StudentOrInstructor') StudentOrInstructor: string,
  ) {
    return this.chatHistoryService.CreateGroup(
      createGroupDto,
      StudentOrInstructor,
    );
  }
  @Get('getGroups/:Admin/:title/:privacy')
  //@Roles('instructor', 'student')
  async getStudentGroups(
    @Param('Admin') Admin: string,
    @Param('title') title: string,
    @Param('privacy') privacy: string,
  ) {
    return this.chatHistoryService.getGroups(Admin, title, privacy);
  }
  @Get('getInstructorGroups/:Admin/:title/:privacy')
  //@Roles('instructor', 'student')
  async getInstructorGroups(
    @Param('Admin') Admin: string,
    @Param('title') title: string,
    @Param('privacy') privacy: string,
  ) {
    return this.chatHistoryService.getInstructorGroups(Admin, title, privacy);
  }
  @Get('getPrivateInstructorGroups/:Admin/:title/:privacy')
  //@Roles('instructor', 'student')
  async getPrivateInstructorGroups(
    @Param('Admin') Admin: string,
    @Param('title') title: string,
    @Param('privacy') privacy: string,
  ) {
    return this.chatHistoryService.getPrivateInstructorGroups(
      Admin,
      title,
      privacy,
    );
  }
  @Get('getInstructorGroupChat/:Admin/:title')
  //@Roles('instructor', 'student')
  async getInstructorGroupChat(
    @Param('Admin') Admin: string,
    @Param('title') title: string,
  ) {
    return this.chatHistoryService.getInstructorGroupChat(Admin, title);
  }
  @Get('getPrivateInstructorGroupChat/:Admin/:title')
  //@Roles('instructor', 'student')
  async getPrivateInstructorGroupChat(
    @Param('Admin') Admin: string,
    @Param('title') title: string,
  ) {
    return this.chatHistoryService.getPrivateInstructorGroupChat(Admin, title);
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
  async createGroupChat(@Body() createGroupDto: CreateGroupDto) {
    return this.chatHistoryService.CreateGroupsDiscussions(createGroupDto);
  }
  @Get('get-discussion')
  async getGroupChat(
    @Query('Title') Title: string,
    @Query('CourseTitle') CourseTitle: string,
  ): Promise<ChatHistory | null> {
    return this.chatHistoryService.getGroupChatByTitleAndCourse(
      Title,
      CourseTitle,
    );
  }
  // @Get('/getProgress/:CourseTitle/:studentEmail')
  // async getProgress(
  //   @Param('CourseTitle') CourseTitle: string,
  //   @Param('studentEmail') studentEmail: string,
  // ) {
  //   return this.progressService.getProgress(CourseTitle, studentEmail);
  // }
}
