import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsSchema } from 'src/schemas/logs.schema';
import { Logs } from 'src/schemas/logs.schema';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: Logs.name, schema: LogsSchema }], 'eLearningDB'),  // Assuming Logs is a Mongoose model
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule { }
