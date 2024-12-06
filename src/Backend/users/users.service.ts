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
import { CoursesService } from '../courses/courses.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>, // Inject the User model for DB operations
    @InjectModel(Logs.name,'eLearningDB')
    private readonly LogsModel:Model<Logs>,
    @InjectModel(Progress.name,'eLearningDB')
    private readonly progressModel:Model<Progress>,
    private courseService: CoursesService,
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


  async updateCompletedLecture(
    studentEmail: string,
    courseTitle: string,
    lectureIndex: number, // Lecture index that the student opened
  ) {
    // Step 1: Get the course details to know the total lectures
    const course = await this.courseService.getCourseByTitle(courseTitle);
    if (!course) {
      throw new Error(`Course with title ${courseTitle} not found`);
    }

    const totalLectures = course.courseContent.length;

    // Step 2: Find the student's progress
    let progress = await this.progressModel.findOne({ studentEmail, Coursetitle: courseTitle });

    if (!progress) {
      // If the progress record does not exist, create a new one
      progress = new this.progressModel({
        studentEmail,
        Coursetitle: courseTitle,
        score: 0,
        completionRate: 0,
        completedLectures: [],
      });
    }

    // Step 3: Update the completed lectures
    const existingLecture = progress.completedLectures.find(
      (lecture) => lecture.Coursetitle === courseTitle,
    );

    if (!existingLecture) {
      // If this course does not exist in the completedLectures array, add it
      progress.completedLectures.push({ Coursetitle: courseTitle, completedLectures: 0 });
    }

    // Increment the completedLectures count
    const lecture = progress.completedLectures.find(
      (lecture) => lecture.Coursetitle === courseTitle,
    );
    if (lecture) {
      lecture.completedLectures += 1;
    }

    // Step 4: Calculate completionRate
    const completionRate = (lecture.completedLectures / totalLectures) * 100;

    // Step 5: Update the progress document
    progress.completionRate = completionRate;
    await progress.save();

    return {
      message: 'Lecture completion updated successfully',
      progress,
    };
  }


}
