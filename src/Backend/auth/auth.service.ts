import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { admin } from 'src/schemas/admin.schema';
import { User } from 'src/schemas/user.schema';
import { Instructor } from 'src/schemas/instructor.schema';
import { Logs } from 'src/schemas/logs.schema';
import { JwtService } from '@nestjs/jwt';
import { Note } from 'src/schemas/note.schema';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(admin.name, 'eLearningDB') private readonly adminModel: Model<admin>,
    @InjectModel(User.name, 'eLearningDB') private readonly userModel: Model<User>,
    @InjectModel(Logs.name, 'eLearningDB') private readonly LogsModel: Model<Logs>,
    @InjectModel(Instructor.name, 'eLearningDB') private readonly instructorModel: Model<Instructor>,
    @InjectModel(Note.name, 'eLearningDB') private readonly NoteModel: Model<Note>
    // private jwtService:JwtService,
  ) { }

  async registerUser(createDto: any, role: 'admin' | 'student' | 'instructor') {

    try {
      if (!createDto.passwordHash) {
        throw new Error('Password is required');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createDto.passwordHash, 10);

      // Determine the model based on role
      let model;
      if (role === 'admin') model = this.adminModel;
      else if (role === 'student') model = this.userModel;
      else if (role === 'instructor') model = this.instructorModel;
      else throw new BadRequestException('Invalid role specified');

      // const emailInIse = await this.model.findOne({ email: createDto.email,});
      // if(emailInIse){
      //   throw new BadRequestException("Email already in Use");
      // }

      // Create and save the user
      const user = new model({
        ...createDto,
        passwordHash: hashedPassword,
      });

      return await user.save();

    } catch (error) {
      console.error('Error during registration:', error);
      throw new Error(`${role} registration failed`);
    }
  }

  async login(email: string, password: string, role: 'admin' | 'student' | 'instructor') {
    try {
      let log = "failed"

      // Determine the model based on role
      let model;
      if (role === 'admin') model = this.adminModel;
      else if (role === 'student') model = this.userModel;
      else if (role === 'instructor') model = this.instructorModel;
      else throw new BadRequestException('Invalid role specified');

      // Find the user by email
      const user = await model.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException(`${role} not found`);
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET is missing!');
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }
      log = "pass";


      // Generate JWT token
      const payload = { id: user._id, name: user.name, email: user.email, role };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      return { accessToken, user, log };
    } catch (error) {
      console.error('Error during login:', error);
      throw new BadRequestException('Login failed');
    }
  }
}