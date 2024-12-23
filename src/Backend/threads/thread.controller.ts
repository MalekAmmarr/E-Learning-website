// thread.controller.ts
import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';

@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  async createThread(@Body() createThreadDto: CreateThreadDto) {
    return this.threadService.createThread(createThreadDto);
  }

  @Get(':forumId')
  async getThreadsByForum(@Param('forumId') forumId: string) {
    return this.threadService.getThreadsByForum(forumId);
  }
  @Patch(':threadId')
  async updateThread(@Param('threadId') threadId: string, @Body() updateThreadDto: UpdateThreadDto) {
    return this.threadService.updateThread(threadId, updateThreadDto);
  }

  @Delete(':threadId')
  async deleteThread(@Param('threadId') threadId: string, @Body('userId') userId: string) {
    await this.threadService.deleteThread(threadId, userId);
  }
}