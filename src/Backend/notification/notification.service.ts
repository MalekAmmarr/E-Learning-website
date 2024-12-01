import { Injectable } from '@nestjs/common';
import { Notification } from 'src/schemas/notification.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name, 'eLearningDB')
    private readonly notificationModel: Model<Notification>,
  ) {}


 /* async sendNotification(userId: string, content: string, type: string) {
    console.log(`Sending ${type} notification to user ${userId}: ${content}`);
    const notification = new this.notificationModel({
      userId,
      content,
      type,
    });
    return notification.save();
  }

    // Fetch notifications for a specific user
    async getNotificationsByUser(userId: string): Promise<Notification[]> {
      return this.notificationModel.find({ userId });
    }
  
    // Mark notification as read
    async markAsRead(notificationId: string): Promise<Notification> {
      return this.notificationModel.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true },
      );
    }*/

}
