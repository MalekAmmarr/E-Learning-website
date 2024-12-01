import { Controller, Get, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';


@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Get('search')
    async searchCourses(@Query('query') query: string) {
      return this.coursesService.searchCourses(query);
    }
}
