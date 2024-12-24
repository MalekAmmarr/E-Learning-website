import { Message, MessageSchema } from './../../schemas/message.schema';
import {
  ChatHistory,
  ChatHistorySchema,
} from './../../schemas/chathistory.schema';
import { Module } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryController } from './chat-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Progress, ProgressSchema } from 'src/schemas/progress.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: ChatHistory.name, schema: ChatHistorySchema },
        { name: Message.name, schema: MessageSchema },
        { name: Progress.name, schema: ProgressSchema },
        { name: User.name, schema: UserSchema },
        { name: Course.name, schema: CourseSchema },
        { name: Instructor.name, schema: InstructorSchema },
      ],
      'eLearningDB',
    ),
  ],

  providers: [ChatHistoryService],
  controllers: [ChatHistoryController],
  exports: [ChatHistoryService],
})
export class ChatHistoryModule {}
