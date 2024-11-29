import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticationLogService } from '../authentication-log/authentication-log.service';// Import AuthenticationLogService

@Injectable()
export class UsersService {
  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(User.name, 'eLearningDB') private readonly userModel: Model<User>, // Inject the User model for DB operations
    private readonly authenticationLogService: AuthenticationLogService,  // Inject AuthenticationLogService for logging
  ) {}


  // Register a new user
    async create(createUserDto: CreateUserDto): Promise<User> {
      try {
        if (!createUserDto.passwordHash) {
          throw new Error('Password is required');
        }
        
        // Hash the user's password
        const hashedPassword = await bcrypt.hash(createUserDto.passwordHash, 10);  // Hash the plain password
    
        // Create a new user document
        const user = new this.userModel({
          ...createUserDto,
          passwordHash: hashedPassword,  // Store the hashed password in 'passwordHash'
        });
    
        // Save the user to the database
        return await user.save();
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('User registration failed');
      }
    }
    
  // Login a user
  async login(email: string, passwordHash: string): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const jwtSecret = process.env.JWT_SECRET;
   if (!jwtSecret) {
      console.error('JWT_SECRET is missing!');
   }
    // Compare the password
    const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Create and return JWT token
    const payload = { userId: user.userId, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { accessToken };
  }
}
