import {
  Controller, Get, Post, Put, Delete, Param,
  Body, NotFoundException, Query, Res, UseGuards, BadRequestException, Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { LogsService } from '../logs/logs.service';
import { Response } from 'express';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FeedbackService } from '../feedback/feedback.service';
import { CreateFeedbackDto } from '../feedback/dto/create-feedback.dto';
import { Feedback } from 'src/schemas/feedback.schema';



@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService,
    private readonly logsService: LogsService,
    private readonly feedbackService: FeedbackService

  ) { }

  // Register a new user
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.registerUser(createUserDto);
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

    const login = await this.userService.loginUser(email, passwordHash);
    const Logs = await this.logsService.create(email, login.log, 'student')
    return login
  }

  // Route to get notifications by email
  @UseGuards(AuthorizationGuard)
  @Get('notifications')
  @Roles('student')
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

  // Endpoint for a student to download a PDF and update their progress
  @UseGuards(AuthorizationGuard)
  @Get('download-pdf')
  @Roles('student')
  async downloadPDF(
    @Query('userEmail') userEmail: string,
    @Query('Coursetitle') Coursetitle: string,
    @Query('pdfUrl') pdfUrl: string,
    @Res() res: Response
  ): Promise<any> {
    try {
      // Let the user download the PDF and update progress
      const result = await this.userService.downloadPDFAndUpdateProgress(userEmail, Coursetitle, pdfUrl);

      // Assuming pdfUrl is a valid link to the PDF, you could serve the file directly:
      res.download(pdfUrl); // Uncomment if you want to serve the file
      res.json(result);  // Respond with success message and download link
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @UseGuards(AuthorizationGuard)
  @Post('createfeedback')
  @Roles('student')
  async createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req, // Access the request object to get user data
  ): Promise<Feedback> {
    const studentemail = req.user.email;

    // Add the email to the feedback data
    const feedbackData = { ...createFeedbackDto, studentemail };

    // Pass the modified data to the service
    return await this.feedbackService.create(feedbackData);
  } catch(error) {
    // Handle unique constraint or validation errors
    const errorMessage = error.message || 'An unexpected error occurred';

    // Throw a BadRequestException with the error message
    throw new BadRequestException(errorMessage);
  }

}



