import { Controller, Post, Body } from '@nestjs/common';
import { EnrollementService } from './enrollement.service';
@Controller('enrollement')
export class EnrollementController {
    constructor(private readonly enrollmentsService: EnrollementService) {}

  @Post('enroll')
  async enroll(@Body() { studentId, courseId }: { studentId: string; courseId: string }) {
    return this.enrollmentsService.enrollStudent(studentId, courseId);
  }
}
