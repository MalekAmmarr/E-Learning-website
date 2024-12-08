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

  async getLogs() {
    try {
      const logs = await this.LogsModel.find();
      return logs;
    }
    catch (error) {
      console.error('Error fetching logs:', error);
      throw new Error('Error fetching logs');
    }
  }


}



