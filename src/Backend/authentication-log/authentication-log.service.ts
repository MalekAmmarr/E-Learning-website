import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthenticationLog } from 'src/schemas/authentication-log.schema';
import { v4 as uuidv4 } from 'uuid'; // For generating unique log IDs
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';  // For generating JWT tokens
import * as bcrypt from 'bcrypt';  // For hashing and comparing passwords

@Injectable()
export class AuthenticationLogService {
  constructor(
    private readonly usersService: UsersService,  // Inject UsersService to access user data
    private readonly jwtService: JwtService,
    @InjectModel(AuthenticationLog.name, 'eLearningDB') private readonly authLogModel: Model<AuthenticationLog>,
  ) {}

  // Create an authentication log
  async createLog(userId: string, event: string, status: string): Promise<AuthenticationLog> {
    const log = new this.authLogModel({
      logId: uuidv4(), // Generate a unique ID for the log
      userId,
      event,
      status,
    });
    return log.save();
  }

  // Get all authentication logs
  async getAllLogs(): Promise<AuthenticationLog[]> {
    return this.authLogModel.find().exec();
  }

  // Get authentication logs for a specific user
  async getUserLogs(userId: string): Promise<AuthenticationLog[]> {
    return this.authLogModel.find({ userId }).exec();
  }

  // Login method: Validate user credentials and generate a JWT token
  async login(email: string, password: string): Promise<any> {
    // Fetch the user based on email
    const user = await this.usersService.findByEmail(email); // Make sure this method exists in UsersService

    if (!user) {
      // Log the failed login attempt
      await this.createLog(user.userId, 'Login Attempt', 'Failed - User not found');
      throw new BadRequestException('User not found');
    }

    // Compare the provided password with the stored password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // Log the failed login attempt
      await this.createLog(user.userId, 'Login Attempt', 'Failed - Invalid credentials');
      throw new BadRequestException('Invalid credentials');
    }

    // Log the successful login attempt
    await this.createLog(user.userId, 'Login Attempt', 'Success');

    // Generate JWT token for the logged-in user
    const payload = { userId: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Return the JWT token
    return { access_token: accessToken };
  }
}
