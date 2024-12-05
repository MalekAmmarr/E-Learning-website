import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { LogsService } from '../logs/logs.service';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly logsService:LogsService ) {}

  // Register a new user
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      console.error('Error during registration:', error); // Log the error for debugging
      throw error; // Rethrow or handle the error appropriately
    }
  }

  // Login a user
  @Post('login')
    async login(@Body() { email, passwordHash }: { email: string; passwordHash: string }) {
     
    const login = await this.userService.login(email, passwordHash);
    const Logs = await this.logsService.create(email,login.log)
    return login
    }
  // Route to get notifications by email
  @Get('notifications')
  async getNotifications(@Body() { email }: { email: string }) {
    // Call the service method to get notifications
    const result = await this.userService.Notifications(email);

    // If no notifications or error message is returned, throw NotFoundException
    if (typeof result.Notifications === 'string') {
      throw new NotFoundException(result.Notifications);
    }

    // Otherwise return the notifications
    return result;
  }

  @Put(':studentEmail/courses/:courseTitle/lectures/:lectureIndex')
  async updateLectureCompletion(
    @Param('studentEmail') studentEmail: string,
    @Param('courseTitle') courseTitle: string,
    @Param('lectureIndex') lectureIndex: number, // lecture index that the student opened
  ) {
    const result = await this.userService.updateCompletedLecture(
      studentEmail,
      courseTitle,
      lectureIndex,
    );
    return result;
  }

}
