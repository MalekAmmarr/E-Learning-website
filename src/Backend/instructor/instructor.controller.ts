import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { Instructor } from 'src/schemas/Instructor.schema';
import { CreateInstructorDto } from './create-Ins.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';
import { LogsController } from '../logs/logs.controller';
import { Logs } from 'src/schemas/logs.schema';
import { LogsService } from '../logs/logs.service';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService,private readonly logsService:LogsService) {}
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
  async login(@Body() { email, passwordHash }: { email: string; passwordHash: string },
  ) {

    const login = await this.instructorService.login(email, passwordHash);
    const Logs = await this.logsService.create(email,login.log)
    return login
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
  // Endpoint to accept or reject a student's course application
  @Post('accept-reject-course') // No email parameter in the URL
  async acceptOrRejectCourse(
    @Body()
    body: {
      email: string;
      courseName: string;
      action: 'accept' | 'reject';
    },
  ): Promise<Object> {
    const { email, courseName, action } = body; // Extracting data from the body

    // Validate the action is either 'accept' or 'reject'
    if (action !== 'accept' && action !== 'reject') {
      throw new BadRequestException('Action must be "accept" or "reject"');
    }

    // Call the service method to accept or reject the course
    const message = await this.instructorService.AcceptOrReject(
      email,
      courseName,
      action,
    );
    return { message };
  }
}
