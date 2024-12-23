import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { Module } from 'src/schemas/module.schema';
import { ModulesService } from './modules.service';
import { UpdateModuleDto } from './dto/UpdateModuleDto';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('modules')
export class ModulesController {
    constructor(private readonly moduleService: ModulesService) {}



  @UseGuards(AuthorizationGuard)
  @Post()
  @Roles('instructor')
  async createModule(@Body() createModuleDto: CreateModuleDto): Promise<Module> {
    return await this.moduleService.createModule(createModuleDto);
  }


  @UseGuards(AuthorizationGuard)
  @Put(':quizId')
  @Roles('instructor')
  async updateModule(
    @Param('quizId') quizId: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<Module> {
    return await this.moduleService.updateModule(quizId, updateModuleDto);
  }

 

  // Method for fetching quiz ID and course title by instructor email
  @UseGuards(AuthorizationGuard)
  @Get('quiz-and-course-by-instructor')
  @Roles('instructor')
  async getQuizIdAndCourseTitleByInstructorEmailformodules(
    @Query('email') instructorEmail: string
  ): Promise<{ quizId: string; courseTitle: string }[]> {
    if (!instructorEmail) {
      throw new BadRequestException('Instructor email is required');
    }

    try {
      return await this.moduleService.getQuizIdAndCourseTitleByInstructorEmail(
        instructorEmail
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthorizationGuard)
  @Get('details-by-quiz-id')
  @Roles('instructor')
  async getModuleDetailsByQuizId(@Query('quizId') quizId: string) {
    return this.moduleService.getModuleDetailsByQuizId(quizId);
  }
}
