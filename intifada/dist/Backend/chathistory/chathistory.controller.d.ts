import { ChathistoryService } from './chathistory.service';
import { ChatHistory } from '../../schemas/chathistory.schema';
export declare class ChathistoryController {
    private readonly chatService;
    constructor(chatService: ChathistoryService);
    saveMessage(messageData: Partial<ChatHistory>): Promise<ChatHistory>;
    getMessages(user1: string, user2: string): Promise<ChatHistory[]>;
}
