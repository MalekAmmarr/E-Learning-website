import { Module } from '@nestjs/common';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Backup, BackupSchema } from '../../schemas/backup.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Backup.name, schema: BackupSchema }],
      'dataManagementDB',
    ),
  ],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}
