import { LogsService } from './logs.service';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    create(email: any, log: any): Promise<import("../../schemas/logs.schema").Logs>;
    getLogs(): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/logs.schema").Logs> & import("../../schemas/logs.schema").Logs & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
