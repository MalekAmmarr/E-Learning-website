import { Module } from '@nestjs/common';
import { AuthenticationLogController } from './authentication-log.controller';
import { AuthenticationLogService } from './authentication-log.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthenticationLog,
  AuthenticationLogSchema,
} from 'src/schemas/authentication-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AuthenticationLog.name, schema: AuthenticationLogSchema }],
      'eLearningDB',
    ),
  ],
  controllers: [AuthenticationLogController],
  providers: [AuthenticationLogService],
  exports: [AuthenticationLogService],
})
export class AuthenticationLogModule {}
