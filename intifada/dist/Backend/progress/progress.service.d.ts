import { Progress } from 'src/schemas/progress.schema';
import { Model } from 'mongoose';
export declare class ProgressService {
    private readonly userinteractionModel;
    constructor(userinteractionModel: Model<Progress>);
}
