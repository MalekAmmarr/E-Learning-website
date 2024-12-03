import { Controller, Post, Body, BadRequestException,Get,Patch,Delete} from '@nestjs/common';
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
    private readonly logsService:LogsService // Inject CoursesService here
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
        console.error('Error during registration:', error); // Log the error for debugging
        throw new BadRequestException('User registration failed');
      }
    }

    @Post('login')
    async login(@Body() { email, passwordHash }: { email: string; passwordHash: string }) {
     
    const login = await this.adminsService.login(email, passwordHash);
    const Logs = await this.logsService.create(email,login.log)
    return login
    }


    @Get('viewCourses')
    async viewCourses(){
      return await this.coursesService.viewCourses();
    }

  @Patch('updateCourse')
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

}
