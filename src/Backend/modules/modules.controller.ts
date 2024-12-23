import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { Module } from 'src/schemas/module.schema';
import { ModulesService } from './modules.service';
import { UpdateModuleDto } from './dto/UpdateModuleDto';

@Controller('modules')
export class ModulesController {
    constructor(private readonly moduleService: ModulesService) {}



  @Post()
  async createModule(@Body() createModuleDto: CreateModuleDto): Promise<Module> {
    return await this.moduleService.createModule(createModuleDto);
  }

  @Put(':quizId')
  async updateModule(
    @Param('quizId') quizId: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<Module> {
    return await this.moduleService.updateModule(quizId, updateModuleDto);
  }
}
