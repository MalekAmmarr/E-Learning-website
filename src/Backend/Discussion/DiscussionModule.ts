import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionGateway } from './DiscussionGateway';
import { DiscussionService } from './DiscussionService';
import { Thread, ThreadSchema } from 'src/schemas/threads.schema';
import { Reply, ReplySchema } from 'src/schemas/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thread.name, schema: ThreadSchema },
      { name: Reply.name, schema: ReplySchema },
    ]),
  ],
  providers: [DiscussionGateway, DiscussionService],
})
export class DiscussionModule {}
