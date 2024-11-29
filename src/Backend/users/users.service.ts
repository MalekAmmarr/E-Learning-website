import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticationLogService } from 'src/backend/authentication-log/authentication-log.service'; // Import AuthenticationLogService

@Injectable()
export class UsersService {
  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>, // Inject the User model for DB operations
    private readonly authenticationLogService: AuthenticationLogService, // Inject AuthenticationLogService for logging
  ) {}
}
