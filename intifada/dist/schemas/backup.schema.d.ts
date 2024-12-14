import { Document } from 'mongoose';
export declare class Backup extends Document {
    backupId: string;
    backupType: string;
    storagePath: string;
    courseId?: string;
    moduleId?: string;
    createdAt: Date;
}
export declare const BackupSchema: import("mongoose").Schema<Backup, import("mongoose").Model<Backup, any, any, any, Document<unknown, any, Backup> & Backup & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Backup, Document<unknown, {}, import("mongoose").FlatRecord<Backup>> & import("mongoose").FlatRecord<Backup> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
