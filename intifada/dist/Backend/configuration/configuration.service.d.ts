import { Model } from 'mongoose';
import { Configuration } from 'src/schemas/configuration.schema';
export declare class ConfigurationService {
    private readonly configurationModel;
    constructor(configurationModel: Model<Configuration>);
}
