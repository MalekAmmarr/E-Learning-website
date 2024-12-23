import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logs } from 'src/schemas/logs.schema';
import { LogsModule } from './logs.module';

@Injectable()
export class LogsService {

  constructor(
    @InjectModel(Logs.name, 'eLearningDB')
    private readonly LogsModel: Model<Logs>, // Inject the User model for DB operations
  ) { }

  async create(email: string, pass: string, role: string): Promise<Logs> {
    try {

      const log = new this.LogsModel({
        email, pass, role
      })

      // Save the user to the database
      return await log.save();

    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Instructor registration failed');
    }
  }

  async getLogs(date: string) {
    try {
      // Convert the input date to the start and end of the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Query the database for logs created within this date range
      const logs = await this.LogsModel.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });

      return logs;
    } catch (error) {
      console.error('Error fetching logs for the given day:', error);
      throw new Error('Error fetching logs for the given day');
    }
  }


}



