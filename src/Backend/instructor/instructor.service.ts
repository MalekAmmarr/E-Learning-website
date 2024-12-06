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
import { CreateInstructorDto } from './dto/create-Ins.dto';
import { User } from 'src/schemas/user.schema';
import { Course } from 'src/schemas/course.schema';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { UpdateCourseDto } from '../courses/dto/update-course.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class InstructorService {
  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(Instructor.name, 'eLearningDB')
    private readonly InstructorModel: Model<Instructor>, // Inject the User model for DB operations
    @InjectModel(User.name, 'eLearningDB')
    private readonly UserModel: Model<User>, // Inject the User model for DB operations
    @InjectModel(Course.name, 'eLearningDB') 
    private courseModel: Model<Course>,
    private readonly authService: AuthService, // Inject AuthService

  ) {}

  // Register a new Instructor
  async registerInstructor(createInstructorDto: CreateInstructorDto) {
    return await this.authService.registerUser(createInstructorDto, 'instructor');
  }

  // Login Intructor
  async loginInstructor(email: string, password: string) {
    return await this.authService.login(email, password, 'instructor');
  }

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

 // Method to create a course by the instructor
  async createCourse(createCourseDto: CreateCourseDto, instructorEmail: string): Promise<Course> {
    // Step 1: Find the instructor by their email (instructorEmail is obtained from JWT token)
    const instructor = await this.InstructorModel.findOne({ email: instructorEmail });

    if (!instructor) {
      throw new Error('Instructor not found');
    }

    // Step 2: Create the course with instructor's email and data
    const newCourse = new this.courseModel({
      ...createCourseDto,  // All course data except instructor email
      instructormail: instructor.email, // Link course to instructor via email
      instructorName: instructor.name,  // Optional: Add instructor's name to course
    });

    // Step 3: Save the course to the database
    const savedCourse = await newCourse.save();

    // Step 4: Add the new course to the instructor's Teach_Courses array
    instructor.Teach_Courses.push(savedCourse.title); // You can use the course title or ID here
    await instructor.save();  // Save the updated instructor document

    return savedCourse;
  }




  // Method to update a course, excluding the courseContent array
  async updateCourse(instructorEmail: string, courseTitle: string, updateCourseDto: UpdateCourseDto) {
    // Check if the instructor exists
    const instructor = await this.InstructorModel.findOne({ email: instructorEmail });
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    // Check if the course exists and belongs to the instructor (by email)
    const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });
    if (!course) {
      throw new NotFoundException('Course not found or you are not the instructor of this course');
    }

    // Prepare the update object by excluding courseContent
    const { courseContent, ...updateData } = updateCourseDto;

    // Update the course details
    const updatedCourse = await this.courseModel.findOneAndUpdate(
      { title: courseTitle, instructormail: instructorEmail },
      updateData,
      { new: true }, // return the updated document
    );

    return updatedCourse;
  }



  async addCourseContent(instructorEmail: string, courseTitle: string, newContent: string[]): Promise<Course> {
    // Find the course by title and instructor email
    const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });
    
    if (!course) {
      throw new NotFoundException('Course not found or you are not the instructor of this course');
    }

    // Ensure newContent is an array before updating
    if (!Array.isArray(newContent)) {
      throw new Error('newContent must be an array');
    }

    // Push the new content to the courseContent array
    course.courseContent.push(...newContent);

    // Save the updated course
    return await course.save();
  }


  // Method to update the course content
  async updateCourseContent(instructorEmail: string, courseTitle: string, newContent: string[]): Promise<Course> {
    // Find the instructor
    const instructor = await this.InstructorModel.findOne({ email: instructorEmail });
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    // Find the course by title and instructor email
    const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });
    if (!course) {
      throw new NotFoundException('Course not found or you are not the instructor of this course');
    }

    // Update the course content (replace it with the new content)
    await this.courseModel.updateOne(
  { title: courseTitle, instructormail: instructorEmail },
  { $push: { courseContent: { $each: newContent } } }
);


    // Save the updated course
    const updatedCourse = await course.save();

    return updatedCourse;
  }

  // Edit course content: Replace the current content with new content
  async editCourseContent(instructorEmail: string, courseTitle: string, newContent: string[]): Promise<Course> {
    const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });

    if (!course) {
      throw new NotFoundException('Course not found or you are not the instructor of this course');
    }

    // Replace the current content with the new content
    course.courseContent = newContent;

    // Save and return the updated course
    return await course.save();
  }

  // Delete specific content from course content array
  async deleteCourseContent(instructorEmail: string, courseTitle: string, contentToDelete: string[]): Promise<Course> {
    const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });

    if (!course) {
      throw new NotFoundException('Course not found or you are not the instructor of this course');
    }

    // Remove the specified content from the courseContent array
    course.courseContent = course.courseContent.filter(content => !contentToDelete.includes(content));

    // Save and return the updated course
    return await course.save();
  }

}
