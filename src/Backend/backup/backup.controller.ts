import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BackupService } from './backup.service';
import { Backup } from 'src/schemas/backup.schema';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Response } from 'express';

@Controller('backups')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  // Get all backups
  @Get()
  async getBackups(): Promise<Backup[]> {
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
  @Get('/Hoss/OpenFile')
async getBackup(
  @Query('storagePath') storagePath: string,  // Change to query parameter
  @Res() res: Response,
) {
  try {
    // Decode the storage path twice to fix double encoding
    const decodedPath = decodeURIComponent(decodeURIComponent(storagePath));

    // Call the service method to handle file download
    await this.backupService.getBackupFile(decodedPath, res);
  } catch (error) {
    // Handle error gracefully
    console.error('Error downloading backup:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to download backup file',
      error: error.message,
    });
  }
}

}  
