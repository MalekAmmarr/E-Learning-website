import { Controller, Post, Body } from '@nestjs/common';
import { EnrollementService } from './enrollement.service';
@Controller('enrollement')
export class EnrollementController {
    constructor(private readonly enrollmentService: EnrollementService) {}

 /* @Post('enroll')
  async enrollStudent(@Body() body: { studentId: string, courseId: string }) {
    const { studentId, courseId } = body;
    const notification = await this.enrollmentService.enrollStudentInCourse(studentId, courseId);
    return { message: 'Student enrolled successfully', notification };
  }*/
}
