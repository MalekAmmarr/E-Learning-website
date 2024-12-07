import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';

@UseGuards(AuthorizationGuard)
@Roles('admin') 
@Controller('logs')

export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async create(@Body() email,log) {
    return await this.logsService.create(email,log);
  }

  @Get('getLogs')
  async getLogs()
  {
    return await this.logsService.getLogs();
  }
 
}
