import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from 'src/schemas/message.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
          [
            { name: 'ChatMessage', schema: ChatMessageSchema },
          ],
          'eLearningDB' // Specify the connection name (use 'eLearningDB' as defined in AppModule)
        ),
      ],
    providers: [ChatGateway, ChatService]
})
export class ChatModule {}