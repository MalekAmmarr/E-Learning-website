import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { Thread , ThreadSchema} from 'src/schemas/threads.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }],

    'eLearningDB',
  ),


],
  controllers: [ThreadController],
  providers: [ThreadService],
  exports: [ThreadService],
})
export class ThreadModule {}