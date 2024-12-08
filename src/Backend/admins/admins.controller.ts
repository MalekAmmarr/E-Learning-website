import { Controller, Post, Body, BadRequestException,Get,Patch,Delete, UseGuards} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CoursesService } from '../courses/courses.service';
import { LogsService } from '../logs/logs.service';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Announcement } from 'src/schemas/announcement.schema';



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
    const Logs = await this.logsService.create(email,login.log)
    return login
    }

  @UseGuards(AuthorizationGuard)
  @Get('viewCourses')
  @Roles('admin')  
  async viewCourses(){
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
  @Delete('deleteCourse')
  @Roles('admin')
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

@Get('getAnnouncement')
async getAllAnnouncements() {
  return await this.adminsService.getAllAnnouncements();
}

@UseGuards(AuthorizationGuard)
@Post('createAnnouncement')
@Roles('admin')
async createAnnouncement(@Body() body: { title: string; content: string }) {
  const { title, content } = body;

  try {
    const announcement = await this.adminsService.createAnnouncement({
      title,
      content,
    });

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


}
