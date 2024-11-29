import { Controller, Get, Post, Body } from '@nestjs/common';
import { BackupService } from './backup.service';
import { Backup } from 'src/schemas/backup.schema';

@Controller('backups')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  async createBackup(@Body() backupData: Partial<Backup>): Promise<Backup> {
    return this.backupService.createBackup(backupData);
  }

  @Get()
  async getAllBackups(): Promise<Backup[]> {
    return this.backupService.getAllBackups();
  }
}
