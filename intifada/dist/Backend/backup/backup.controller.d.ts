import { BackupService } from './backup.service';
import { Backup } from '../../schemas/backup.schema';
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    createBackup(backupData: Partial<Backup>): Promise<Backup>;
    getAllBackups(): Promise<Backup[]>;
}
