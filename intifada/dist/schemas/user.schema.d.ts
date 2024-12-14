import mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare class User extends Document {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    roleMetadata: Record<string, any>;
    learningPreferences: string[];
    isHardcoded: boolean;
    profilePictureUrl?: string;
    createdAt: Date;
    pendingCourses: string[];
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
