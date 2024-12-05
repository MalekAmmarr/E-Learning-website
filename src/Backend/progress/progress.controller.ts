import { Controller, Get, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {

    constructor(private readonly progressService: ProgressService) {}

    // Endpoint for an instructor to get a student's progress by email
    @Get(':instructorEmail/:studentEmail')
    async getStudentProgress(
      @Param('instructorEmail') instructorEmail: string,
      @Param('studentEmail') studentEmail: string
    ) {
      return this.progressService.getStudentProgress(instructorEmail, studentEmail);
    }
}
