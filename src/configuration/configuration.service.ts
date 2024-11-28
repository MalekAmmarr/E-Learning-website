import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Configuration } from 'src/schemas/configuration.schema';

@Injectable()
export class ConfigurationService {
    constructor(
        @InjectModel(Configuration.name, 'eLearningDB') private readonly configurationModel: Model<Configuration>) {}
    
}
