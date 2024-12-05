import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CoursesService } from '../courses/courses.service';
import { Course,CourseSchema } from 'src/schemas/course.schema';
import { LogsService } from '../logs/logs.service';

@Controller('admins')
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly coursesService: CoursesService,
    private readonly logsService: LogsService,
  ) {}

  @Post('register')
  async register(@Body() createAdminDto: CreateAdminDto) {
    try {
      const admin = await this.adminsService.create(createAdminDto);
      return {
        message: 'Admin registered successfully',
        admin,
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new BadRequestException('User registration failed');
    }
  }

  @Post('login')
  async login(@Body() { email, passwordHash }: { email: string; passwordHash: string }) {
    const login = await this.adminsService.login(email, passwordHash);
    const Logs = await this.logsService.create(email, login.log);
    return login;
  }

  @Get('viewCourses')
  async viewCourses() {
    return await this.coursesService.viewCourses();
  }

  @Patch('updateCourse')
  async updateCourse(@Body() updateData: { courseId: string; updates: Record<string, any> }) {
    const { courseId, updates } = updateData;
    try {
      const updatedCourse = await this.coursesService.updateCourses(courseId, updates);
      return {
        message: 'Course updated successfully',
        updatedCourse,
      };
    } catch (error) {
      console.error('Error during course update:', error);
      throw new BadRequestException('Course update failed');
    }
  }

  @Patch('archiveCourse')
  async archiveCourse(@Body() body: { courseId: string }) {
    const { courseId } = body;
    try {
      const archivedCourse = await this.coursesService.ArchiveCourse(courseId);
      return {
        message: 'Course archived successfully',
        archivedCourse,
      };
    } catch (error) {
      console.error('Error during course archiving:', error);
      throw new BadRequestException('Course archiving failed');
    }
  }

  @Delete('deleteCourse')
  async deleteCourse(@Body() body: { courseId: string }) {
    const { courseId } = body;
    try {
      const deletedCourse = await this.coursesService.DeleteCourse(courseId);
      return {
        message: 'Course deleted successfully',
        deletedCourse,
      };
    } catch (error) {
      console.error('Error during course deletion:', error);
      throw new BadRequestException('Course deletion failed');
    }
  }

  // **Step 2 Features**

  // Manage student accounts
  //Calls getAllStudents to retrieve all student accounts.
  @Get('students')
  async getStudents() {
    try {
      return await this.adminsService.getAllStudents();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new BadRequestException('Failed to fetch students');
    }
  }
//Calls updateStudent to update a specific student's details.
@Patch('students/updateByEmail/:email')
async updateStudentByEmail(
  @Param('email') email: string, // Capture email from route
  @Body() updates: Record<string, any>, // Capture updates from request body
) {
  try {
    // Call the service method to update the student by email
    const updatedStudent = await this.adminsService.updateStudentByEmail(email, updates);

    return {
      message: 'Student updated successfully',
      updatedStudent,
    };
  } catch (error) {
    console.error('Error updating student:', error); // Log the error for debugging
    throw new BadRequestException('Failed to update student');
  }
}

@Delete('students/deleteByEmail/:email')
async deleteStudentByEmail(@Param('email') email: string) {
  try {
    return await this.adminsService.deleteStudentByEmail(email);
  } catch (error) {
    console.error('Error deleting student by email:', error);
    throw new BadRequestException('Failed to delete student by email');
  }
}


  // Manage instructor accounts
  //Calls getAllInstructors to retrieve all instructor accounts.
  @Get('instructors')
  async getInstructors() {
    try {
      return await this.adminsService.getAllInstructors();
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw new BadRequestException('Failed to fetch instructors');
    }
  }
//Calls updateInstructor to update a specific instructor's details.
  @Patch('instructors/:email')
  async updateInstructor(
    @Param('email') email: string,
    @Body() updates: Record<string, any>,
  ) {
    try {
      const updatedInstructor = await this.adminsService.updateInstructor(email, updates);
      return {
        message: 'Instructor updated successfully',
        updatedInstructor,
      };
    } catch (error) {
      console.error('Error updating instructor:', error);
      throw new BadRequestException('Failed to update instructor');
    }
  }
//Calls deleteInstructor to remove a specific instructor account.
  @Delete('instructors/:email')
  async deleteInstructor(@Param('email') email: string) {
    try {
      return await this.adminsService.deleteInstructor(email);
    } catch (error) {
      console.error('Error deleting instructor:', error);
      throw new BadRequestException('Failed to delete instructor');
    }
  }

  // Monitor unauthorized access logs
  //Calls getLogs to fetch all access or unauthorized login attempt logs.
  @Get('logs')
  async getLogs() {
    try {
      return await this.logsService.getLogs();
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw new BadRequestException('Failed to fetch logs');
    }
  }
}
