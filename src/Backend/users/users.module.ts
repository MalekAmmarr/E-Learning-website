import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthenticationLogModule } from '../authentication-log/authentication-log.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'eLearningDB'),AuthenticationLogModule
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
