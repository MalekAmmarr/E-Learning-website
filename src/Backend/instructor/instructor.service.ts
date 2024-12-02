import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor } from 'src/schemas/Instructor.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { CreateInstructorDto } from './create-Ins.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class InstructorService {
  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(Instructor.name, 'eLearningDB')
    private readonly InstructorModel: Model<Instructor>, // Inject the User model for DB operations
    @InjectModel(User.name, 'eLearningDB')
    private readonly UserModel: Model<User>, // Inject the User model for DB operations
  ) {}
  // Method to get all users applied to courses taught by an instructor
  async getUsersAppliedToCourses(email: string) {
    // Find the instructor by ID
    const instructor = await this.InstructorModel.findOne({
      email,
    }).exec();

    if (!instructor) {
      throw new NotFoundException(
        ` cannot find this Instructor email: ${instructor}`,
      );
    }

    // Extract the courses the instructor teaches
    const teachCourses = instructor.Teach_Courses;

    // Find users who have applied for these courses
    const users = await this.UserModel.find({
      appliedCourses: { $in: teachCourses }, // MongoDB `$in` operator matches any value in the array
    });

    return users;
  }

  // Register a new user
  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    try {
      if (!createInstructorDto.passwordHash) {
        throw new Error('Password is required');
      }

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(
        createInstructorDto.passwordHash,
        10,
      ); // Hash the plain password

      // Create a new user document
      const user = new this.InstructorModel({
        ...createInstructorDto,
        passwordHash: hashedPassword, // Store the hashed password in 'passwordHash'
      });

      // Save the user to the database
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Instructor registration failed');
    }
  }
  // Login a user
  async login(
    email: string,
    passwordHash: string,
  ): Promise<{ accessToken: string }> {
    const Instructor = await this.InstructorModel.findOne({ email }).exec();
    if (!Instructor) {
      throw new NotFoundException('Instrutor not found');
    }
    console.log(Instructor);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is missing!');
    }
    // Compare the password
    const isPasswordValid = await bcrypt.compare(
      passwordHash,
      Instructor.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Create and return JWT token
    const payload = { name: Instructor.name, email: Instructor.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { accessToken };
  }
  async AcceptOrReject(
    email: string,
    courseName: string,
    action: 'accept' | 'reject',
  ): Promise<String> {
    try {
      // Find the user by email
      const user = await this.UserModel.findOne({ email });

      if (!user) {
        throw new Error(`User with email ${email} not found.`);
      }

      // Check if the course exists in `appliedCourses`
      const courseIndex = user.appliedCourses.indexOf(courseName);
      if (courseIndex === -1) {
        throw new Error(`Course ${courseName} not found in appliedCourses.`);
      }

      // Remove the course from `appliedCourses`
      user.appliedCourses.splice(courseIndex, 1);

      // If accepted, add the course to `acceptedCourses`
      if (action === 'accept') {
        if (!user.acceptedCourses.includes(courseName)) {
          user.acceptedCourses.push(courseName);
          user.Notifiction
            .push(`Congratulations! You have been accepted into the course  ${courseName}.
             We are excited to have you join and look forward to your participation. Please check the course details 
             in your dashboard for further instructions. Best of luck with your studies!`);
        }
      } else {
        user.Notifiction
          .push(`Unfortunately, your application for the course ${courseName} has been rejected. 
          We appreciate your interest and encourage you to apply for other courses in the future. 
          Feel free to explore more options in your dashboard. Best wishes for your learning journey!`);
      }

      // Save the updated user document
      await user.save();

      return `Successfully ${action === 'accept' ? 'accepted' : 'rejected'} course ${courseName} for user ${email}.`;
    } catch (error) {
      console.error(`Error in AcceptOrReject: ${error.message}`);
      throw error;
    }
  }
}
