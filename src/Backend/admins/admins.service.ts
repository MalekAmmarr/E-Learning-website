import { Injectable,NotFoundException,BadRequestException, } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { admin } from 'src/schemas/admin.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/schemas/user.schema';
import { Instructor } from 'src/schemas/instructor.schema';
import { decrypt } from 'dotenv';
import { Course } from 'src/schemas/course.schema';
import { Logs } from 'src/schemas/logs.schema';
import { AuthService } from '../auth/auth.service';
import { Announcement } from 'src/schemas/announcement.schema';

@Injectable()
export class AdminsService {

  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(Announcement.name,'eLearningDB')
    private readonly AnnouncementModel : Model<Announcement>,
    @InjectModel(Course.name,'eLearningDB')
    private readonly courseModel : Model<Course>, // Inject the admin model for DB operations
    @InjectModel(admin.name,'eLearningDB')
    private readonly adminModel : Model<admin>, // Inject the admin model for DB operations
    @InjectModel(Instructor.name, 'eLearningDB')
    private readonly InstructorModel: Model<Instructor>, // Inject the Instructor model for DB operations
    @InjectModel(User.name, 'eLearningDB')
    private readonly UserModel: Model<User>, // Inject the User model for DB operations
    @InjectModel(Logs.name,'eLearningDB')
    private readonly logsModel:Model<Logs>,
    private readonly authService: AuthService, // Inject AuthService

  ) {}
  
 
  // Register a new Admin
  async registerAdmin(createAdminDto: CreateAdminDto) {
    return await this.authService.registerUser(createAdminDto, 'admin');
  }

  // Login Admin
  async loginAdmin(email: string, password: string) {
    return await this.authService.login(email, password, 'admin');
  } 


  async createAnnouncement( title: string, content: string,createdBy:string): Promise<Announcement> {
    try {
      const newAnnouncement = new this.AnnouncementModel({  title, content ,createdBy});

      return await newAnnouncement.save();
    } catch (error) {
      console.error('Error during announcement creation:', error);
      throw new Error('Failed to create announcement');
    }
  }


  


  async getAllAnnouncements() {
    return await this.AnnouncementModel.find(); // Retrieves all announcements
  }

  async updateAnnouncementByTitle(title: string, updates: Record<string, any>) {
    return await this.AnnouncementModel.findOneAndUpdate(
      { title }, // Search condition
      updates,   // Updates to apply
      { new: true } // Return the updated document
    );
  }

  async deleteAnnouncementByTitle(title: string) {
    return await this.AnnouncementModel.findOneAndDelete({ title });
  }
  
  
  
// *Step 2 Features*

  // Get all students
  //Fetches a list of all students in the database.
  async getAllStudents(): Promise<User[]> {
    try {
      return await this.UserModel.find().exec();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  async updateStudentByEmail(email: string, updates: Record<string, any>): Promise<User> {
    try {
      console.log(`Updating student with email: ${email}`);
      console.log('Updates:', updates);
  
      const updatedStudent = await this.UserModel.findOneAndUpdate(
        { email: email },
        updates,
        { new: true }
      );
  
      if (!updatedStudent) {
        console.error('No student found with the provided email.');
        throw new NotFoundException('Student not found');
      }
  
      console.log('Successfully updated student:', updatedStudent);
      return updatedStudent;
    } catch (error) {
      console.error('Error updating student by email:', error);
      throw new Error('Failed to update student');
    }
  }
  
  

  async deleteStudentByEmail(email: string): Promise<User> {
    try {
      const deletedStudent = await this.UserModel.findOneAndDelete({ email: email });
      if (!deletedStudent) {
        throw new NotFoundException('Student not found');
      }
      return deletedStudent;
    } catch (error) {
      console.error('Error deleting student by email:', error);
      throw new Error('Failed to delete student by email');
    }
  }
  

  // Fetches a list of all instructors.
  async getAllInstructors(): Promise<Instructor[]> {
    try {
      return await this.InstructorModel.find().exec();
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw new Error('Failed to fetch instructors');
    }
  }

  // Updates the details of a specific instructor using their id
  async updateInstructor(email: string, updates: Record<string, any>): Promise<Instructor> {
    try {
      console.log(`Updating student with email: ${email}`);
      console.log('Updates:', updates);
  
      const updateInstructor = await this.InstructorModel.findOneAndUpdate(
        { email: email },
        updates,
        { new: true }
      );
  
      if (!updateInstructor) {
        console.error('No student found with the provided email.');
        throw new NotFoundException('Student not found');
      }
  
      console.log('Successfully updated student:', updateInstructor);
      return updateInstructor;
    } catch (error) {
      console.error('Error updating student by email:', error);
      throw new Error('Failed to update student');
    }
  }

  // Deletes a specific instructor account by their id.
  async deleteInstructor(email: string): Promise<Instructor> {
    try {
      const deletedInstructor = await this.InstructorModel.findOneAndDelete({email: email});
      if (!deletedInstructor) {
        throw new NotFoundException('Instructor not found');
      }
      return deletedInstructor;
    } catch (error) {
      console.error('Error deleting instructor:', error);
      throw new Error('Failed to delete instructor');
    }
  }

  // Fetches the logs of login attempts or unauthorized access for monitoring purposes.
  async getLogs(): Promise<Logs[]> {
    try {
      return await this.logsModel.find().exec();
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw new Error('Failed to fetch logs');
    }
  }
}





