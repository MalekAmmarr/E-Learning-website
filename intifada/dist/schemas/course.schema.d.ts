import { Document } from 'mongoose';
export declare class Course extends Document {
    courseId: string;
    title: string;
    instructorId: string;
    instructorName?: string;
    description: string;
    category: string;
    difficultyLevel: string;
    isArchived: boolean;
    totalClasses: number;
    createdBy: string;
}
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
