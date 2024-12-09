import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { Backup } from 'src/schemas/backup.schema';
import * as path from 'path';
import { admin } from 'src/schemas/admin.schema';
import { User } from 'src/schemas/user.schema';
import { Response } from 'express';

@Injectable()
export class BackupService {
  constructor(
    @InjectModel(Backup.name, 'dataManagementDB')
    private readonly backupModel: Model<Backup>,
    @InjectModel(admin.name, 'eLearningDB')
    private readonly adminModel: Model<admin>, // Admin schema
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>, // User schema
  ) {}

  // Fetch all backups
  async getBackups(): Promise<Backup[]> {
    return this.backupModel.find().exec();
  }

  // Fetch a specific backup by ID
  async getBackupById(backupId: string) {
    const backup = await this.backupModel.findOne({ backupId }).exec();
    if (!backup) {
      throw new NotFoundException(`Backup with ID ${backupId} not found`);
    }
    return backup;
  }

  // Create a backup (manual or scheduled)
  async createBackup() {
    try {
      // Fetch data from admins and users collections
      const admins = await this.adminModel.find().exec();
      const users = await this.userModel.find().exec();

      // Prepare backup data
      const backupData = {
        admins,
        users,
      };

      // Save backup to a file
      const timestamp = new Date().toISOString().split('T')[0];
      const backupFilePath = path.join('/backups', `backup-${timestamp}.json`);

      // Check if the directory exists, if not create it
      const backupDir = path.dirname(backupFilePath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Save the data to the file
      fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

      // Save backup metadata in MongoDB
      const backup = new this.backupModel({
        backupId: `backup_${new Date().getTime()}`,
        backupType: 'database',
        storagePath: backupFilePath,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save the backup and return it
      return await backup.save();
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new InternalServerErrorException('Failed to create backup');
    }
  }

  // Delete a backup by ID
  async deleteBackup(backupId: string) {
    const result = await this.backupModel.findOneAndDelete({ backupId }).exec();
    if (!result) {
      throw new NotFoundException(`Backup with ID ${backupId} not found`);
    }
    return { message: `Backup with ID ${backupId} deleted successfully` };
  }

  // Automatically create a backup every month
  @Cron(CronExpression.EVERY_6_MONTHS)
  async scheduleMonthlyBackup() {
    console.log('Running every 6 month scheduled backup...');
    return this.createBackup();
  }

  async getBackupFile(storagePath: string, res: Response): Promise<any> {
    try {
      // Resolve the absolute path of the file
      const absolutePath = path.resolve(storagePath);

      // Check if the file exists
      if (!fs.existsSync(absolutePath)) {
        throw new NotFoundException('Backup file not found');
      }

      // Read the file contents (Optional: if you want to parse it to JSON)
      const fileContent = fs.readFileSync(absolutePath, 'utf8');

      // Optional: Parse the content to JSON (if needed for other logic)
      const parsedContent = JSON.parse(fileContent);

      // If you want to send the file as a downloadable response:
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${path.basename(absolutePath)}`,
      );
      res.setHeader('Content-Type', 'application/json');

      // Create a read stream and pipe it to the response (to download the file)
      const fileStream = fs.createReadStream(absolutePath);
      fileStream.pipe(res);

      // Return the parsed content if needed for other logic
      return parsedContent;
    } catch (error) {
      console.error('Error reading backup file:', error);
      throw new NotFoundException('Failed to retrieve backup file');
    }
  }
}
