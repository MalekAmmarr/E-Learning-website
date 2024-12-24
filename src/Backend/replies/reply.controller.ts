// reply.controller.ts
import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  async createReply(@Body() createReplyDto: CreateReplyDto) {
    return this.replyService.createReply(createReplyDto);
  }

  @Get(':threadId')
  async getRepliesByThread(@Param('threadId') threadId: string) {
    return this.replyService.getRepliesByThread(threadId);
  }
  @Patch(':replyId')
  async updateReply(@Param('replyId') replyId: string, @Body() updateReplyDto: UpdateReplyDto) {
    return this.replyService.updateReply(replyId, updateReplyDto);
  }

  @Delete(':replyId')
  async deleteReply(@Param('replyId') replyId: string, @Body('userId') userId: string) {
    await this.replyService.deleteReply(replyId, userId);
  }
}