import mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare class Instructor extends Document {
    email: string;
    name: string;
    age: string;
    passwordHash: string;
    Teach_Courses: string[];
    profilePictureUrl?: string;
    Certificates: string;
}
export declare const InstructorSchema: mongoose.Schema<Instructor, mongoose.Model<Instructor, any, any, any, mongoose.Document<unknown, any, Instructor> & Instructor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Instructor, mongoose.Document<unknown, {}, mongoose.FlatRecord<Instructor>> & mongoose.FlatRecord<Instructor> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
