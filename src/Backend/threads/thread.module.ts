import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { Thread , ThreadSchema} from 'src/schemas/threads.schema';
import { ReplyModule } from '../replies/reply.module';
import { Reply , ReplySchema } from 'src/schemas/reply.schema';

@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: Thread.name, schema: ThreadSchema },
      { name : Reply.name, schema: ReplySchema}

    
    ],

    'eLearningDB',
  ),


],
  controllers: [ThreadController],
  providers: [ThreadService, ReplyModule],
  exports: [ThreadService],
})
export class ThreadModule {}