import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticationLogService } from 'src/authentication-log/authentication-log.service';  // Import AuthenticationLogService

@Injectable()
export class UsersService {
  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(User.name, 'eLearningDB') private readonly userModel: Model<User>, // Inject the User model for DB operations
    private readonly authenticationLogService: AuthenticationLogService,  // Inject AuthenticationLogService for logging
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = new this.userModel(createUserDto);
    return user.save();
  }

  // Get user by ID
  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // Get user by email (new method)
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Update user details
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // Delete a user
  async delete(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  // Assign a role to the user
  async assignRole(userId: string, role: string): Promise<User> {
    const validRoles = ['student', 'instructor', 'admin'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    const user = await this.userModel.findByIdAndUpdate(userId, { role }, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // Log authentication event
  logAuthenticationEvent(userId: string, event: string, status: string) {
    return this.authenticationLogService.createLog(userId, event, status);
  }
}
