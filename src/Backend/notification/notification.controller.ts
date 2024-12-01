import { Controller, Get, Param, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from 'src/schemas/notification.schema';

@Controller('notification')
export class NotificationController {

    constructor(private readonly notificationService: NotificationService) {}

  // Fetch all notifications for a specific user
  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationService.getNotificationsByUser(userId);
  }

  // Mark a specific notification as read
  @Put('read/:notificationId')
  async markAsRead(@Param('notificationId') notificationId: string): Promise<Notification> {
    return this.notificationService.markAsRead(notificationId);
  }
}
