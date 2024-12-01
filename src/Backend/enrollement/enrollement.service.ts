import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollement, EnrollementSchema } from 'src/schemas/enrollement.schema';
import { NotificationService } from '../notification/notification.service';
import { Course, CourseSchema } from 'src/schemas/course.schema';

@Injectable()
export class EnrollementService {
  constructor(
    @InjectModel(Enrollement.name, 'eLearningDB')
    private readonly enrollmentModel: Model<Enrollement>,private notificationService: NotificationService,
    private readonly courseModel: Model<Course>, // Service to send notifications
  ) {
    console.log('NotificationService:', notificationService);
  }

  async enrollStudent(studentId: string, courseId: string) {
    const enrollment = new this.enrollmentModel({ studentId, courseId });
    await enrollment.save();

    // Send enrollment confirmation notification to the student
    const course = await this.courseModel.findById(courseId);
    await this.notificationService.sendNotification(
      studentId,
      `You have successfully enrolled in the course: ${course.title}`,
      'Enrollment Confirmation',
    );

    return enrollment;
  }
}
