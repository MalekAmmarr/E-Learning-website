import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
  async login(
    @Body() { email, passwordHash }: { email: string; passwordHash: string },
  ) {
    return await this.userService.login(email, passwordHash);
  }
}
