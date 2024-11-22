import { Module } from '@nestjs/common';
import { ChathistoryController } from './chathistory.controller';
import { ChathistoryService } from './chathistory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistory, ChatHistorySchema } from '../schemas/chathistory.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ChatHistory.name, schema: ChatHistorySchema }]),],
  controllers: [ChathistoryController],
  providers: [ChathistoryService]
})
export class ChathistoryModule {}
