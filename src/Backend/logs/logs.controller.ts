import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';

@UseGuards(AuthorizationGuard)
@Roles('admin')
@Controller('logs')

export class LogsController {
  constructor(private readonly logsService: LogsService) { }

  @Post()
  async create(@Body() email, pass, role) {
    return await this.logsService.create(email, pass, role);
  }

  @Get('getLogs/:date')
  async getLogs(@Param('date') date: string) {
    return await this.logsService.getLogs(date);
  }

  @Delete(':id')
  async deleteLog(@Param('id') logId: string) {
    return await this.logsService.deleteLogById(logId);
  }

}
