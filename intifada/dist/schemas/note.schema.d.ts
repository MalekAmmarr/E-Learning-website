import { Document } from 'mongoose';
export declare class Note extends Document {
    noteId: string;
    userId: string;
    courseId?: string;
    content: string;
    isThread: boolean;
    comments: {
        commentId: string;
        commenterId: string;
        commentText: string;
        timestamp: Date;
    }[];
    lastUpdated: Date;
}
export declare const NoteSchema: import("mongoose").Schema<Note, import("mongoose").Model<Note, any, any, any, Document<unknown, any, Note> & Note & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Note, Document<unknown, {}, import("mongoose").FlatRecord<Note>> & import("mongoose").FlatRecord<Note> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
