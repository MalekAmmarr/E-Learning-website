import { Module } from '@nestjs/common';
import { AuthenticationLogController } from './authentication-log.controller';
import { AuthenticationLogService } from './authentication-log.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationLog, AuthenticationLogSchema} from '../schemas/authentication-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthenticationLog.name , schema: AuthenticationLogSchema }]),
  ],
  controllers: [AuthenticationLogController],
  providers: [AuthenticationLogService]
})
export class AuthenticationLogModule {}
