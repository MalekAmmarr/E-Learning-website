import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Endpoint for an instructor to get a student's progress by email
  // @UseGuards(AuthorizationGuard)
  @Get(':instructorEmail/:studentEmail')
  //@Roles('instructor', 'student')
  async getStudentProgress(
    @Param('instructorEmail') instructorEmail: string,
    @Param('studentEmail') studentEmail: string,
  ) {
    return this.progressService.getStudentProgress(
      instructorEmail,
      studentEmail,
    );
  }
  @Get('/getProgress/:CourseTitle/:studentEmail')
  async getProgress(
    @Param('CourseTitle') CourseTitle: string,
    @Param('studentEmail') studentEmail: string,
  ) {
    return this.progressService.getProgress(CourseTitle, studentEmail);
  }
}
