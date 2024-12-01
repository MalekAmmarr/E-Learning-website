import { Module } from '@nestjs/common';
import { AuthenticationLogController } from './authentication-log.controller';
import { AuthenticationLogService } from './authentication-log.service';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MongooseModule.forFeature(

    ),
  ],
  controllers: [AuthenticationLogController],
  providers: [AuthenticationLogService],
  exports: [AuthenticationLogService],
})
export class AuthenticationLogModule { }
