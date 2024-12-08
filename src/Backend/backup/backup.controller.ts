import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { BackupService } from './backup.service';
import { Backup } from 'src/schemas/backup.schema';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('backups')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  // Get all backups
  @Get()
  async getBackups() : Promise<Backup[]> {
    return this.backupService.getBackups();
  }

  // Get a specific backup by backupId
  @Get(':backupId')
  async getBackupById(@Param('backupId') backupId: string) {
    return this.backupService.getBackupById(backupId);
  }

  // Create a new backup (manual)
  @Post('create')
  async createBackup() {
    return this.backupService.createBackup();
  }

  // Delete a backup by backupId
  @Delete(':backupId')
  async deleteBackup(@Param('backupId') backupId: string) {
    return this.backupService.deleteBackup(backupId);
  }
}
