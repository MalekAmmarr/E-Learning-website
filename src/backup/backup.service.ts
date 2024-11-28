import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Backup } from '../schemas/backup.schema';

@Injectable()
export class BackupService {
  constructor(@InjectModel(Backup.name,'dataManagementDB') private backupModel: Model<Backup>) {}

  async createBackup(backupData: Partial<Backup>): Promise<Backup> {
    const backup = new this.backupModel(backupData);
    return backup.save();
  }

  async getAllBackups(): Promise<Backup[]> {
    return this.backupModel.find().exec();
  }
}


