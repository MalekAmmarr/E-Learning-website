import mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare class admin extends Document {
    email: string;
    name: string;
    passwordHash: string;
    profilePictureUrl?: string;
}
export declare const AdminSchema: mongoose.Schema<admin, mongoose.Model<admin, any, any, any, mongoose.Document<unknown, any, admin> & admin & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, admin, mongoose.Document<unknown, {}, mongoose.FlatRecord<admin>> & mongoose.FlatRecord<admin> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
