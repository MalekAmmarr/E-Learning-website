import { Document } from 'mongoose';
export declare class ChatHistory extends Document {
    messageId: string;
    senderId: string;
    receiverId: string;
    message: string;
    courseId?: string;
    threadId?: string;
    timestamp: Date;
}
export declare const ChatHistorySchema: import("mongoose").Schema<ChatHistory, import("mongoose").Model<ChatHistory, any, any, any, Document<unknown, any, ChatHistory> & ChatHistory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatHistory, Document<unknown, {}, import("mongoose").FlatRecord<ChatHistory>> & import("mongoose").FlatRecord<ChatHistory> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
