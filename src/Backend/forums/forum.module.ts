import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { Forum, ForumSchema } from 'src/schemas/forum.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }],'eLearningDB',


  ),
],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
