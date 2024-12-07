import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BackupService } from './backup.service';
import { Backup } from 'src/schemas/backup.schema';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('backups')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @UseGuards(AuthorizationGuard)
  @Post('createBackup')
  @Roles('admin')  
  async createBackup(@Body() backupData: Partial<Backup>): Promise<Backup> {
    return this.backupService.createBackup(backupData);
  }

  @UseGuards(AuthorizationGuard)
  @Get('getBackup')
  @Roles('admin')  
  async getAllBackups(): Promise<Backup[]> {
    return this.backupService.getAllBackups();
  }
}
