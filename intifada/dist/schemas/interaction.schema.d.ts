import { Document } from 'mongoose';
export declare class UserInteraction extends Document {
    interactionId: string;
    userId: string;
    courseId: string;
    score: number;
    timeSpentMinutes: number;
    lastAccessed: Date;
}
export declare const UserInteractionSchema: import("mongoose").Schema<UserInteraction, import("mongoose").Model<UserInteraction, any, any, any, Document<unknown, any, UserInteraction> & UserInteraction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserInteraction, Document<unknown, {}, import("mongoose").FlatRecord<UserInteraction>> & import("mongoose").FlatRecord<UserInteraction> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
