import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthenticationLog } from 'src/schemas/authentication-log.schema';
import { v4 as uuidv4 } from 'uuid'; // For generating unique log IDs
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'; // For generating JWT tokens
import * as bcrypt from 'bcrypt'; // For hashing and comparing passwords

@Injectable()
export class AuthenticationLogService {
  constructor(
    @InjectModel(AuthenticationLog.name, 'eLearningDB')
    private readonly authLogModel: Model<AuthenticationLog>,
  ) {}
}
