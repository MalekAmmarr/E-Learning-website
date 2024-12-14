import { Model } from 'mongoose';
import { ChatHistory } from '../../schemas/chathistory.schema';
export declare class ChathistoryService {
    private chatModel;
    constructor(chatModel: Model<ChatHistory>);
    saveMessage(messageData: Partial<ChatHistory>): Promise<ChatHistory>;
    getMessagesBetweenUsers(user1: string, user2: string): Promise<ChatHistory[]>;
}
