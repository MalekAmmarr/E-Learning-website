import { Notification } from 'src/schemas/notification.schema';
import { Model } from 'mongoose';
export declare class NotificationService {
    private readonly userinteractionModel;
    constructor(userinteractionModel: Model<Notification>);
}
