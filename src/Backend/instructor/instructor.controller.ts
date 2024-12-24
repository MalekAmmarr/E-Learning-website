import { Message } from 'src/schemas/message.schema';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';

import { InstructorService } from './instructor.service';
import { Instructor } from 'src/schemas/Instructor.schema';
import { CreateInstructorDto } from './dto/create-Ins.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';
import { Course } from 'src/schemas/course.schema';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { UpdateCourseDto } from '../courses/dto/update-course.dto';
import { AddContentDto } from '../courses/dto/add-content.dto';
import { EditContentDto } from '../courses/dto/edit-content.dto';
import { DeleteContentDto } from '../courses/dto/delete-content.dto';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { get } from 'mongoose';
import { FeedbackService } from '../feedback/feedback.service';
import { Feedback } from 'src/schemas/feedback.schema';
import { UsersService } from '../users/users.service';

@Controller('instructor')
export class InstructorController {
  constructor(
    private readonly instructorService: InstructorService,
    private readonly logsService: LogsService,
    private readonly feedbackService: FeedbackService,
    private readonly userService: UsersService,
  ) { }

  // Register a new user
  @Post('register')
  async register(@Body() createInstructorDto: CreateInstructorDto) {
    try {
      const Instructor =
        await this.instructorService.registerInstructor(createInstructorDto);
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
    let log = "failed"; // Default to "failed"

    try {
      // Attempt to log in
      const login = await this.instructorService.loginInstructor(email, passwordHash);

      // If login is successful, set log to "pass"
      log = login.log;

      // Save log to logsService
      await this.logsService.create(email, log, 'instructor');

      // Return the login response
      return login;
    } catch (error) {
      console.error('Login failed:', error);

      // Save failed log to logsService
      await this.logsService.create(email, log, 'instructor');

      // Re-throw the error so the client receives it
      throw new BadRequestException('Login failed');
    }
  }

  @UseGuards(AuthorizationGuard)
  @Get('getbyemail/:email')
  @Roles('instructor')
  async getInstructorByEmail(
    @Param('email') email: string,
  ): Promise<Instructor> {
    return this.instructorService.getInstructorByEmail(email);
  }

  @UseGuards(AuthorizationGuard)
  @Post('inscontent')
  @Roles('instructor')
  async getCourseContent(
    @Body() { courseTitle }: { courseTitle: string },
  ): Promise<any> {
    if (!courseTitle) {
      throw new BadRequestException('Course title is required');
    }

    try {
      const result = await this.userService.getCourse(courseTitle);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get users applied to courses taught by an instructor
  @UseGuards(AuthorizationGuard)
  @Get('applied-users/:email')
  @Roles('instructor')
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
  @UseGuards(AuthorizationGuard)
  @Post('accept-reject-course') // No email parameter in the URL
  @Roles('instructor')
  async acceptOrRejectCourse(
    @Body()
    body: {
      email: string;
      courseName: string;
      action: 'accept' | 'reject';
    },
  ): Promise<{ user: User; message: string }> {
    const { email, courseName, action } = body; // Extracting data from the body

    // Validate the action is either 'accept' or 'reject'
    if (action !== 'accept' && action !== 'reject') {
      throw new BadRequestException('Action must be "accept" or "reject"');
    }

    // Call the service method to accept or reject the course
    const { user, message } = await this.instructorService.AcceptOrReject(
      email,
      courseName,
      action,
    );

    return { user, message };
  }

  @UseGuards(AuthorizationGuard)
  @Get('email/:email/students')
  @Roles('instructor')
  async getStudents(@Param('email') instructorEmail: string): Promise<User[]> {
    return this.instructorService.getStudentsForInstructorByEmail(
      instructorEmail,
    );
  }

  // // Endpoint to create a course
  // @UseGuards(AuthorizationGuard)
  @Post(':email/create-course')
  // @Roles('instructor')
  async createCourse(
    @Param('email') email: string, // Instructor email in the URL param
    @Body() createCourseDto: CreateCourseDto, // Course data in the request body
  ): Promise<Course> {
    // Call the service method to create the course
    return this.instructorService.createCourse(createCourseDto, email);
  }

  // Update a course except for the courseContent field, linked by instructor email and course title
  //@UseGuards(AuthorizationGuard)
  @Put(':instructorEmail/courses/:courseTitle')
  //@Roles('instructor')
  async updateCourse(
    @Param('instructorEmail') instructorEmail: string,
    @Param('courseTitle') courseTitle: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const updatedCourse = await this.instructorService.updateCourse(
      instructorEmail,
      courseTitle,
      updateCourseDto,
    );
    return updatedCourse;
  }

  @UseGuards(AuthorizationGuard)
  @Put(':instructorEmail/addcontent/:courseTitle')
  @Roles('instructor')
  async addCourseContent(
    @Param('instructorEmail') instructorEmail: string,
    @Param('courseTitle') courseTitle: string,
    @Body() addContentDto: AddContentDto, // Use the DTO here
  ) {
    return await this.instructorService.addCourseContent(
      instructorEmail,
      courseTitle,
      addContentDto.newContent,
    );
  }

  // Edit course content (replace the current content with new content)
  @UseGuards(AuthorizationGuard)
  @Put(':instructorEmail/courses/:courseTitle/editcontent')
  @Roles('instructor')
  async editCourseContent(
    @Param('instructorEmail') instructorEmail: string,
    @Param('courseTitle') courseTitle: string,
    @Body() editContentDto: EditContentDto, // DTO for new content
  ) {
    return await this.instructorService.editCourseContent(
      instructorEmail,
      courseTitle,
      editContentDto.newContent,
    );
  }

  // Delete specific content from course content array
  //@UseGuards(AuthorizationGuard)
  @Delete(':instructorEmail/courses/:courseTitle/deletecontent')
  //@Roles('instructor')
  async deleteCourseContent(
    @Param('instructorEmail') instructorEmail: string,
    @Param('courseTitle') courseTitle: string,
    @Body() deleteContentDto: DeleteContentDto, // DTO for content to delete
  ) {
    return await this.instructorService.deleteCourseContent(
      instructorEmail,
      courseTitle,
      deleteContentDto.contentToDelete,
    );
  }

  // 1. Endpoint to get the number of enrolled students in a course
  @UseGuards(AuthorizationGuard)
  @Get('enrolled-students/:courseTitle')
  @Roles('instructor')
  async getEnrolledStudentsCount(
    @Param('courseTitle') courseTitle: string,
  ): Promise<number> {
    return this.instructorService.getEnrolledStudents(courseTitle);
  }

 



  // 2. Endpoint to get the number of students who completed the course
  @UseGuards(AuthorizationGuard)
  @Get('completed-students/:courseTitle')
  @Roles('instructor')
  async getCompletedStudentsCount(
    @Param('courseTitle') courseTitle: string,
  ): Promise<number> {
    return this.instructorService.getCompletedStudentsCount(courseTitle);
  }




  // 3. Endpoint to get the number of students based on their scores
  @UseGuards(AuthorizationGuard)
  @Get('students-score/:courseTitle')
  @Roles('instructor')
  async getStudentsByScore(
    @Param('courseTitle') courseTitle: string,
  ): Promise<any> {
    return this.instructorService.getStudentsByScore(courseTitle);
  }

  @UseGuards(AuthorizationGuard)
  @Get('courses/byinsemail')
  @Roles('instructor')
  async getCourses(@Query('email') email: string): Promise<string[]> {
    return this.instructorService.getCoursesByInstructor(email);
  }


  @UseGuards(AuthorizationGuard)
  @Get('course/bytitle')
  @Roles('instructor')
  async getCourseDetails(@Query('title') title: string) {
    const course = await this.instructorService.findCourseByTitle(title);
    if (!course) {
      throw new NotFoundException(`Course with title "${title}" not found`);
    }
    return course;
  }

  @UseGuards(AuthorizationGuard)
  @Get(':email/students-progress')
  @Roles('instructor')
  async getStudentsAndProgressByEmail(@Param('email') email: string) {
    return this.instructorService.getStudentsBycourses(email);
  }

  @UseGuards(AuthorizationGuard)
  @Get('students/:email/progress')
  @Roles('instructor')
  async getStudentProgress(@Param('email') studentEmail: string) {
    return this.instructorService.getStudentProgressByEmail(studentEmail);
  }

  @UseGuards(AuthorizationGuard)
  @Get('email/:email')
  @Roles('instructor')
  async getStudentByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findUserByEmail(email);
  }

  @UseGuards(AuthorizationGuard)
  @Post('send-notification')
  @Roles('instructor')
  async sendNotificationToStudents(
    @Body('instructorEmail') instructorEmail: string,
    @Body('courseTitle') courseTitle: string,
    @Body('notificationMessage') notificationMessage: string,
  ): Promise<string> {
    return this.instructorService.sendNotificationToStudentsByEmail(
      instructorEmail,
      courseTitle,
      notificationMessage,
    );
  }
}
