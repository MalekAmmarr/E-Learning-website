import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollement, EnrollementSchema } from 'src/schemas/enrollement.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { User } from 'src/schemas/user.schema';
import { Notification } from 'src/schemas/notification.schema';
@Injectable()
export class EnrollementService {
  constructor(
    @InjectModel(Enrollement.name, 'eLearningDB') private readonly enrollementModel: Model<Enrollement>,
    @InjectModel(Notification.name,'eLearningDB') private readonly notificationModel: Model<Notification>,
    @InjectModel(User.name,  'eLearningDB')  private readonly userModel: Model<User>,
    @InjectModel(Course.name,'eLearningDB' ) private readonly courseModel: Model<Course>,
  ) {}

 /* async enrollStudentInCourse(studentId: string, courseId: string): Promise<Notification> {
    const session = await this.enrollementModel.db.startSession();
    session.startTransaction();
    try {
      // Cast the studentId to ObjectId
      const studentObjectId = new Types.ObjectId(studentId);
  
      // Find the student and course
      const student = await this.userModel.findById(studentObjectId);
      const course = await this.courseModel.findOne({ courseId });
  
      // Check if student exists
      if (!student) {
        throw new Error(`Student with ID ${studentId} not found`);
      }
  
      // Check if course exists
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
  
      // Check for existing enrollment to prevent duplicates
      const existingEnrollment = await this.enrollementModel.findOne({
        studentId: student._id,
        courseId,
      });
      if (existingEnrollment) {
        throw new Error('Student is already enrolled in this course');
      }
  
      // Create the enrollment
      const enrollment = new this.enrollementModel({
        studentId: student._id,
        courseId,
        isCompleted: false,
        isDropped: false,
      });
      await enrollment.save({ session });
  
      // Create the notification
      const notificationContent = `You have successfully enrolled in the course: ${course.title}.`;
      const notification = new this.notificationModel({
        notificationId: new Types.ObjectId(),
        userId: student._id,
        content: notificationContent,
        type: 'Enrollment Confirmation',
        isRead: false,
      });
      await notification.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      return notification;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error during enrollment:', error);
      throw new Error(`Enrollment failed: ${error.message}`);
    }
  }*/
  
}
