import { Controller, Post, Get, Body, Param,Delete, Patch } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDto } from './dto/create-forum.dto';

@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  async createForum(@Body() createForumDto: CreateForumDto) {
    return this.forumService.createForum(createForumDto);
  }

  @Get(':courseId')
  async getForumsByCourse(@Param('courseId') courseId: string) {
    return this.forumService.getForumsByCourse(courseId);
  }

  @Patch(':forumId/join')
  async joinForum(@Param('forumId') forumId: string, @Body('studentId') studentId: string) {
    return this.forumService.joinForum(forumId, studentId);
  }
  @Delete(':forumId')
  async deleteForum(@Param('forumId') forumId: string, @Body('instructorId') instructorId: string) {
    await this.forumService.deleteForum(forumId, instructorId);
  }
}
