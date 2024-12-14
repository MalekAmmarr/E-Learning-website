import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
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


@Controller('instructor')
export class InstructorController {

  constructor(
    private readonly instructorService: InstructorService,
    private readonly logsService: LogsService,
    private readonly feedbackService: FeedbackService
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
    const login = await this.instructorService.loginInstructor(email, passwordHash);
    const Logs = await this.logsService.create(email, login.log, 'instructor')
    return login;
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




  // Endpoint to create a course
  @UseGuards(AuthorizationGuard)
  @Post(':email/create-course')
  @Roles('instructor')
  async createCourse(

    @Param('email') email: string,  // Instructor email in the URL param
    @Body() createCourseDto: CreateCourseDto,  // Course data in the request body

  ): Promise<Course> {
    // Call the service method to create the course
    return this.instructorService.createCourse(createCourseDto, email);
  }

  // Update a course except for the courseContent field, linked by instructor email and course title
  @UseGuards(AuthorizationGuard)
  @Put(':instructorEmail/courses/:courseTitle')
  @Roles('instructor')
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
  @UseGuards(AuthorizationGuard)
  @Delete(':instructorEmail/courses/:courseTitle/deletecontent')
  @Roles('instructor')
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
   @Get('enrolled-students/:courseTitle')
   async getEnrolledStudentsCount(
     @Param('courseTitle') courseTitle: string,
   ): Promise<number> {
     return this.instructorService.getEnrolledStudents(courseTitle);
   }
 
   // 2. Endpoint to get the number of students who completed the course
   @Get('completed-students/:courseTitle')
   async getCompletedStudentsCount(
     @Param('courseTitle') courseTitle: string,
   ): Promise<number> {
     return this.instructorService.getCompletedStudentsCount(courseTitle);
   }
 
   // 3. Endpoint to get the number of students based on their scores
   @Get('students-score/:courseTitle')
   async getStudentsByScore(
     @Param('courseTitle') courseTitle: string,
   ): Promise<any> {
     return this.instructorService.getStudentsByScore(courseTitle);
   }

}
