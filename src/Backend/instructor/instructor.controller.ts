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
import { InstructorService } from './instructor.service';
import { Instructor } from 'src/schemas/Instructor.schema';
import { CreateInstructorDto } from './create-Ins.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}
  // Register a new user
  @Post('register')
  async register(@Body() createInstructorDto: CreateInstructorDto) {
    try {
      const Instructor =
        await this.instructorService.create(createInstructorDto);
      return {
        message: 'Instructor registered successfully',
        Instructor,
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
    return await this.instructorService.login(email, passwordHash);
  }
  // Get users applied to courses taught by an instructor
  @Get('applied-users/:email')
  async getUsersAppliedToCourses(@Param('email') instructorEmail: string) {
    try {
      return await this.instructorService.getUsersAppliedToCourses(
        instructorEmail,
      );
    } catch (error) {
      console.error('Error fetching users applied to courses:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('An error occurred while fetching users.');
    }
  }
}
