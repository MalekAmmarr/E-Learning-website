// Discussion Module

import { Module } from '@nestjs/common';
import { ForumModule } from '../forums/forum.module';
import { ThreadModule } from '../threads/thread.module';
import { ReplyModule } from '../replies/reply.module';
import { DiscussionGateway } from './discussion.gateway';

@Module({
  imports: [ForumModule, ThreadModule, ReplyModule],
  providers: [DiscussionGateway],
  exports: [DiscussionGateway],
})
export class DiscussionModule {}