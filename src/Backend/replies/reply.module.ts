import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { Reply , ReplySchema } from 'src/schemas/reply.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }],

    'eLearningDB',
  ),
  


],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService],
})
export class ReplyModule {}