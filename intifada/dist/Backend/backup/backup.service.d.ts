import { Model } from 'mongoose';
import { Backup } from '../../schemas/backup.schema';
export declare class BackupService {
    private backupModel;
    constructor(backupModel: Model<Backup>);
    createBackup(backupData: Partial<Backup>): Promise<Backup>;
    getAllBackups(): Promise<Backup[]>;
}
