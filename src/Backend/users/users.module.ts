import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthenticationLogModule } from '../authentication-log/authentication-log.module';
import { Logs,LogsSchema } from 'src/schemas/logs.schema';
import { LogsModule } from '../logs/logs.module';
import { LogsService } from '../logs/logs.service';
import { LogsController } from '../logs/logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        {name:Logs.name,schema:LogsSchema}
      ],
      'eLearningDB',
    ),
    AuthenticationLogModule,LogsModule
  ],
  controllers: [UsersController],
  providers: [UsersService,LogsService],
  exports: [MongooseModule],
})
export class UsersModule {}
