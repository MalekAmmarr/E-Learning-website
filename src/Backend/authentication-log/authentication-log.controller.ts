// authentication-log.controller.ts or logs.controller.ts

import { Controller, Get, Post,Body, Param, UseGuards } from '@nestjs/common';
import { AuthenticationLogService } from './authentication-log.service';
import { AuthenticationLog } from '../schemas/authentication-log.schema';
import { AdminGuard } from '../users/guards/admin.guard';


@Controller('logs')
export class AuthenticationLogController {
  constructor(private readonly authLogService: AuthenticationLogService) {}

  // Get all authentication logs (only accessible by admins)
  @UseGuards(AdminGuard)
  @Get()
  async getAllLogs(): Promise<AuthenticationLog[]> {
    return this.authLogService.getAllLogs();
  }

  // Get logs for a specific user (only accessible by admins)
  @UseGuards(AdminGuard)
  @Get(':userId')
  async getUserLogs(@Param('userId') userId: string): Promise<AuthenticationLog[]> {
    return this.authLogService.getUserLogs(userId);
  }

  // Login a user
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }): Promise<any> {
    return this.authLogService.login(loginDto.email, loginDto.password);
  }
}
