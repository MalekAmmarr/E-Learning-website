import { Controller, Get, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from 'src/schemas/course.schema';


@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    // Endpoint to search for courses by title or instructor email
  @Get('search')
  async searchCourses(
    @Query('query') query: string,
  ): Promise<Course[]> {
    if (!query) {
      return [];
    }
    return this.coursesService.searchCourses(query);
  }
}
