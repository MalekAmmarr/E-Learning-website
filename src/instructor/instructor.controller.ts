import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InstructorService } from './instructor.service';

@Controller('instructor')
export class InstructorController {

    constructor(private readonly instructorService: InstructorService) {}

  // HTTP GET endpoint to get all students who applied to the instructor's courses
  @Get(':email/students')
  async getStudentsForInstructor(@Param('email') email: string) {
    try {
      // Fetch students who applied to the courses taught by the instructor
      const students = await this.instructorService.getStudentsAppliedToInstructorCourses(email);

      if (students.length === 0) {
        throw new NotFoundException('No students found for the given instructor.');
      }

      return {
        message: 'Students fetched successfully',
        data: students,
      };
    } catch (error) {
      throw new NotFoundException(error.message || 'Instructor not found or no students applied.');
    }
  }
}
