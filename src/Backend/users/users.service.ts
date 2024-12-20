import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logs } from 'src/schemas/logs.schema';
import { Progress } from 'src/schemas/progress.schema';
import { AuthService } from '../auth/auth.service';
import { Course } from 'src/schemas/course.schema';
import { FeedbackService } from '../feedback/feedback.service';

@Injectable()
export class UsersService {
  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>, // Inject the User model for DB operations
    @InjectModel(Logs.name, 'eLearningDB')
    private readonly LogsModel: Model<Logs>,
    @InjectModel(Course.name, 'eLearningDB')
    private readonly courseModel: Model<Course>,
    @InjectModel(Progress.name, 'eLearningDB')
    private readonly progressModel: Model<Progress>,
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  // Register a new Student
  async registerUser(createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto, 'student');
  }

  // Login Student
  async loginUser(email: string, password: string) {
    return await this.authService.login(email, password, 'student');
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).exec();
  }
  async Notifications(
    email: string,
  ): Promise<{ Notifications: string[] | string }> {
    const user = await this.userModel.findOne({ email }).exec();

    // Check if user exists and has notifications
    const notifications = user?.Notifiction || [];

    // If there are no notifications, return a message
    if (notifications.length === 0) {
      return { Notifications: 'You currently have no new notifications.' };
    }

    return { Notifications: notifications };
  }

  // Method to allow a student to download a PDF and update their progress
  async downloadPDFAndUpdateProgress(
    userEmail: string,
    Coursetitle: string,
    pdfUrl: string,
  ): Promise<any> {
    // Find the user
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new Error('Student not found');
    }

    // Find the course
    const course = await this.courseModel.findOne({ title: Coursetitle });
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if the course is in the user's accepted courses
    if (!user.acceptedCourses.includes(Coursetitle)) {
      throw new Error('Student has not been accepted in this course');
    }

    // Find the progress for the user in this course
    let progress = await this.progressModel.findOne({
      studentEmail: userEmail,
      Coursetitle: course.title,
    });
    if (!progress) {
      progress = new this.progressModel({
        studentEmail: userEmail,
        Coursetitle: course.title,
        score: 0,
        completionRate: 0,
        completedLectures: [],
      });
    }

    // Check if the pdfUrl exists in the courseContent array
    if (!course.courseContent.includes(pdfUrl)) {
      throw new Error('The provided PDF URL is not part of the course content');
    }
    // Return the URL of the PDF for the student to download (or just a success message)
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com'
        : 'http://localhost:3000';
    const downloadLink = `${baseUrl}/files/${pdfUrl}`;

    // Check if the lecture is already marked as completed (by its PDF URL or some other unique identifier)

    const existingLecture = progress.completedLectures.find(
      (lecture) => lecture.pdfUrl === pdfUrl,
    );
    if (existingLecture) {
      return {
        message:
          'PDF download link generated successfully but not for the first Time',
        downloadLink,
      };
    }

    // Add the completed lecture to the progress (assuming the PDF corresponds to a completed lecture)
    progress.completedLectures.push({
      Coursetitle: course.title,
      pdfUrl,
      completedLectures: 1,
    });

    // Calculate the new completion rate
    const completedLecturesCount = progress.completedLectures.length;
    const completionRate =
      (completedLecturesCount / course.courseContent.length) * 100;

    // Update the progress document with the new completion rate
    progress.completionRate = completionRate;
    await progress.save();

    return {
      message: 'PDF download link generated successfully',
      downloadLink,
    };
  }

  async findUserById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ _id: userId }).exec();
      if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
      }
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Error finding user.');
    }
  }

  async getCourse(courseTitle: string): Promise<{ content: string[] }> {
    // Find the course document by title
    const course = await this.courseModel.findOne({ title: courseTitle });

    // Handle case where the course is not found
    if (!course) {
      throw new Error(`Course with title ${courseTitle} not found.`);
    }

    // Extract the content field
    const content = course.courseContent;

    // Return the content in the expected format
    return { content };
  }

  async getUserWithProgressByEmail(studentEmail: string): Promise<any> {
    // Find the user by email
    const user = await this.userModel
      .findOne({ email: studentEmail })
      .populate('progress') // Populate the progress field
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Map the user data with their progress details
    const result = {
      email: user.email,
      name: user.name,
      age: user.age,
      profilePictureUrl: user.profilePictureUrl,
      appliedCourses: user.appliedCourses,
      acceptedCourses: user.acceptedCourses,
      GPA: user.GPA, // Calculate GPA using the virtual method
      notifications: user.Notifiction,
      feedback: user.feedback,
      notes: user.Notes,
      progress: user.progress, // Populated progress details
    };

    return result;
  }
}
