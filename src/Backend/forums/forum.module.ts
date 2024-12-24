import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { Forum, ForumSchema } from 'src/schemas/forum.schema';
import { ThreadModule } from '../threads/thread.module';
import { ReplyModule } from '../replies/reply.module';
import { Thread , ThreadSchema } from 'src/schemas/threads.schema';
import { Reply, ReplySchema } from 'src/schemas/reply.schema';

@Module({
  imports: [MongooseModule.forFeature(
    [
    { name: Forum.name, schema: ForumSchema },
    { name: Thread.name, schema: ThreadSchema },
    { name: Reply.name, schema: ReplySchema },
  
  ],'eLearningDB',


  ),
],
  controllers: [ForumController],
  providers: [ForumService, ThreadModule, ReplyModule],
})
export class ForumModule {}
