import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from 'src/schemas/course.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Endpoint to search for courses by title or instructor email
  @Get('search')
  async searchCourses(@Query('query') query: string): Promise<Course[]> {
    if (!query) {
      return [];
    }
    return this.coursesService.searchCourses(query);
  }
  @Get('Courses')
  async getCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }
  @Get('CoursesTitle')
  async getCoursesTitle(): Promise<string[]> {
    return this.coursesService.getAllCoursesTitle();
  }
  @Get('CoursesTitle/:title')
  async getCoursesByTitle(@Param('title') title: string): Promise<Course> {
    return this.coursesService.getAllCoursesByTitle(title);
  }

  @Get('category/:title')
  async getCategoryByTitle(@Param('title') title: string): Promise<string> {
    const category = await this.coursesService.getCategoryByTitle(title);
    if (category) {
      return category; // Return the category if found
    } else {
      throw new Error('Course not found');
    }
  }
  
}
