import { Document } from 'mongoose';
export declare class Enrollment extends Document {
    studentId: string;
    courseId: string;
    isCompleted: boolean;
    isDropped: boolean;
}
export declare const EnrollmentSchema: import("mongoose").Schema<Enrollment, import("mongoose").Model<Enrollment, any, any, any, Document<unknown, any, Enrollment> & Enrollment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Enrollment, Document<unknown, {}, import("mongoose").FlatRecord<Enrollment>> & import("mongoose").FlatRecord<Enrollment> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
