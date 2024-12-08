import { Model } from 'mongoose';
import { Logs } from 'src/schemas/logs.schema';
export declare class LogsService {
    private readonly LogsModel;
    constructor(LogsModel: Model<Logs>);
    create(email: string, pass: string): Promise<Logs>;
    getLogs(): Promise<(import("mongoose").Document<unknown, {}, Logs> & Logs & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
