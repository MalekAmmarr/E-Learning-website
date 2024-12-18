import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionGateway } from './DiscussionGateway';
import { DiscussionService } from './DiscussionService';
import { Thread, ThreadSchema } from 'src/schemas/threads.schema';
import { Reply, ReplySchema } from 'src/schemas/reply.schema';
import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';
import { InstructorService } from '../instructor/instructor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thread.name, schema: ThreadSchema },
      { name: Reply.name, schema: ReplySchema },
      { name: Instructor.name, schema: InstructorSchema },
    ]),
  ],
  providers: [DiscussionGateway, DiscussionService, InstructorService],
})
export class DiscussionModule {}
