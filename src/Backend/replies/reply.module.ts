import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { Reply , ReplySchema } from 'src/schemas/reply.schema';
import { ThreadModule } from '../threads/thread.module';
import { Thread, ThreadSchema } from 'src/schemas/threads.schema';
@Module({
  imports: [MongooseModule.forFeature(
    [{ name: Reply.name, schema: ReplySchema },
     { name: Thread.name, schema: ThreadSchema} 


    ],

    'eLearningDB',
  ),
  


],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService],
})
export class ReplyModule {}