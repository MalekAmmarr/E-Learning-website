import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogsService } from './logs.service';


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
