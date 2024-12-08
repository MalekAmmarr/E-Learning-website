import { Document } from 'mongoose';
export declare class Module extends Document {
    moduleId: string;
    courseId: string;
    title: string;
    content: string;
    difficulty: string;
}
export declare const ModuleSchema: import("mongoose").Schema<Module, import("mongoose").Model<Module, any, any, any, Document<unknown, any, Module> & Module & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Module, Document<unknown, {}, import("mongoose").FlatRecord<Module>> & import("mongoose").FlatRecord<Module> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
