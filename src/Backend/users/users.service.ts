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
    private courseService: CoursesService
  ) {}

  // Register a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      if (!createUserDto.passwordHash) {
        throw new Error('Password is required');
      }

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(createUserDto.passwordHash, 10); // Hash the plain password

      // Create a new user document
      const user = new this.userModel({
        ...createUserDto,
        passwordHash: hashedPassword, // Store the hashed password in 'passwordHash'
      });

      // Save the user to the database
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User registration failed');
    }
  }

  // Login a user
  async login(
    email: string,
    passwordHash: string,
  ): Promise<{ accessToken: string ; log:string}> {
    let log = "failed"
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      const accessToken="Invalid Credentials"
       return {accessToken ,log  }
      //throw new NotFoundException('Instrutor not found');
    }
    console.log(user);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is missing!');
    }
    // Compare the password
    const isPasswordValid = await bcrypt.compare(
      passwordHash,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      const accessToken="Invalid Credentials"
       return {accessToken ,log }
    }
    log = "pass";

    // Create and return JWT token
    const payload = { name: user.name, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    return { accessToken, log };
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
