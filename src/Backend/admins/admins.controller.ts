import { Controller, Post, Body, BadRequestException, Get, Patch, Delete, UseGuards, Param } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CoursesService } from '../courses/courses.service';
import { LogsService } from '../logs/logs.service';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Announcement } from 'src/schemas/announcement.schema';
import { FeedbackService } from '../feedback/feedback.service';
import { Feedback } from 'src/schemas/feedback.schema';
import { throwError } from 'rxjs';



@Controller('admins')
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly coursesService: CoursesService,
    private readonly logsService: LogsService,
    private readonly feedbackService: FeedbackService
  ) { }
  @Post('register')
  async register(@Body() createAdminDto: CreateAdminDto) {
    try {
      const admin = await this.adminsService.registerAdmin(createAdminDto);
      return {
        message: 'Admin registered successfully',
        admin,
      };
    } catch (error) {
      console.error('Error during registration:', error); // Log the error for debugging
      throw new BadRequestException('Admin registration failed');
    }
  }

  @Post('login')
  async login(@Body() { email, passwordHash }: { email: string; passwordHash: string }) {

    const login = await this.adminsService.loginAdmin(email, passwordHash);
    const Logs = await this.logsService.create(email, login.log, 'admin')
    return login
  }

  @Get('viewCourses')
  @Roles('admin')
  async viewCourses() {
    return await this.coursesService.viewCourses();
  }

  @UseGuards(AuthorizationGuard)
  @Patch('updateCourse')
  @Roles('admin')
  async updateCourse(@Body() updateData: { courseId: string; updates: Record<string, any> },
  ) {
    const { courseId, updates } = updateData;
    try {
      const updatedCourse = await this.coursesService.updateCourses(courseId, updates);
      return {
        message: 'Course updated successfully',
        updatedCourse,
      };
    } catch (error) {
      console.error('Error during course update:', error); // Log the error for debugging
      throw new BadRequestException('Course update failed');
    }
  }

  @UseGuards(AuthorizationGuard)
  @Patch('archiveCourse')
  @Roles('admin')
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

  @UseGuards(AuthorizationGuard)
@Patch('restoreCourse')
@Roles('admin')
async restoreCourse(@Body() body: { courseId: string }) {
  const { courseId } = body;
  if (!courseId) {
    throw new BadRequestException('courseId is required.');
  }

  try {
    const restoredCourse = await this.coursesService.restoreCourse(courseId);

    return {
      message: 'Course restored successfully',
      restoredCourse,
    };
  } catch (error) {
    console.error('Error during course restoring:', error.message);
    throw new BadRequestException('Course restoring failed.');
  }
}

  

  @UseGuards(AuthorizationGuard)
  @Delete('deleteCourse')
  @Roles('admin')
  async deleteCourse(@Body() body: { title: string }) {
    const { title } = body;
   try {
     const deletedCourse = await this.coursesService.DeleteCourse(title);
     return {
       message: 'Course deleted successfully',
       deletedCourse,
     };
    } catch (error) {
     console.error('Error during course deletion:', error);
     throw new BadRequestException('Course deletion failed');
   }
 }

  @Get('getAnnouncement')
  async getAllAnnouncements() {
    return await this.adminsService.getAllAnnouncements();
  }

  @UseGuards(AuthorizationGuard)
  @Post('createAnnouncement')
  @Roles('admin')
  async createAnnouncement(@Body() body: {  title: string; content: string ;createdBy:string}) {
    const {  title, content ,createdBy} = body;
  
    try {
      const announcement = await this.adminsService.createAnnouncement( title, content,createdBy);
  
      return {
        message: 'Announcement created successfully',
        announcement,
      };
    } catch (error) {
      console.error('Error during announcement creation:', error);
      throw new BadRequestException('Failed to create announcement');
    }
  }


  @UseGuards(AuthorizationGuard)
  @Patch('editAnnouncement')
  @Roles('admin')
  async editAnnouncement(@Body() body: { title: string; content: string }) {
    const { title, content } = body;

    try {
      // Search for the announcement by title and update the content
      const updatedAnnouncement = await this.adminsService.updateAnnouncementByTitle(title, { content });

      if (!updatedAnnouncement) {
        throw new BadRequestException('Announcement with the specified title does not exist');
      }

      return {
        message: 'Announcement updated successfully',
        updatedAnnouncement,
      };
    } catch (error) {
      console.error('Error during announcement update:', error);
      throw new BadRequestException('Failed to update announcement');
    }
  }

  @UseGuards(AuthorizationGuard)
  @Delete('deleteAnnouncement')
  @Roles('admin')
  async deleteAnnouncement(@Body() body: { title: string }) {
    const { title } = body;

    try {
      const deletedAnnouncement = await this.adminsService.deleteAnnouncementByTitle(title);

      if (!deletedAnnouncement) {
        throw new BadRequestException('Announcement with the specified title does not exist');
      }

      return {
        message: 'Announcement deleted successfully',
        deletedAnnouncement,
      };
    } catch (error) {
      console.error('Error during announcement deletion:', error);
      throw new BadRequestException('Failed to delete announcement');
    }
  }


  // *Step 2 Features*

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
  @UseGuards(AuthorizationGuard)
  @Delete('students/deleteByEmail/:email')
  @Roles('admin')
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
      const updatedInstructor = await this.adminsService.updateInstructor(email, updates) ;
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
  @UseGuards(AuthorizationGuard)
  @Delete('instructors/:email')
  @Roles('admin')
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

