import mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare class Logs extends Document {
    email: string;
    pass: string;
}
export declare const LogsSchema: mongoose.Schema<Logs, mongoose.Model<Logs, any, any, any, mongoose.Document<unknown, any, Logs> & Logs & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Logs, mongoose.Document<unknown, {}, mongoose.FlatRecord<Logs>> & mongoose.FlatRecord<Logs> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
