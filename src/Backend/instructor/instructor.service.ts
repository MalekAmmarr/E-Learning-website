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
import { Progress } from 'src/schemas/progress.schema';

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
    @InjectModel(Progress.name, 'eLearningDB')
    private progressModel: Model<Progress>,
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  // Register a new Instructor
  async registerInstructor(createInstructorDto: CreateInstructorDto) {
    return await this.authService.registerUser(
      createInstructorDto,
      'instructor',
    );
  }

  // Login Intructor
  async loginInstructor(email: string, password: string) {
    return await this.authService.login(email, password, 'instructor');
  }

  async getInstructorByEmail(email: string): Promise<Instructor> {
    const instructor = await this.InstructorModel.findOne({ email }).exec();
    if (!instructor) {
      throw new NotFoundException(`Instructor with email ${email} not found`);
    }
    return instructor;
  }


  async deleteCourse(instructorEmail: string, courseTitle: string): Promise<void> {
    const result = await this.courseModel.deleteOne({
      instructormail: instructorEmail,
      title: courseTitle,
    });
  
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Course with title "${courseTitle}" not found for instructor "${instructorEmail}".`,
      );
    }
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
  ): Promise<{ user: User; message: string }> {
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
          user.courseScores.push({ courseTitle: courseName, score: 0 });
          user.Notifiction.push(
            `Congratulations! You have been accepted into the course ${courseName}.
             We are excited to have you join and look forward to your participation. Please check the course details 
             in your dashboard for further instructions. Best of luck with your studies!`,
          );
        }
      } else {
        user.Notifiction.push(
          `Unfortunately, your application for the course ${courseName} has been rejected. 
           We appreciate your interest and encourage you to apply for other courses in the future. 
           Feel free to explore more options in your dashboard. Best wishes for your learning journey!`,
        );
      }

      // Save the updated user document
      await user.save();

      const message = `Successfully ${action === 'accept' ? 'accepted' : 'rejected'} course ${courseName} for user ${email}.`;
      return { user, message };
    } catch (error) {
      console.error(`Error in AcceptOrReject: ${error.message}`);
      throw error;
    }
  }

  async getStudentsForInstructorByEmail(instructorEmail: string): Promise<User[]> {
    // Find the instructor by email
    const instructor = await this.InstructorModel.findOne({ email: instructorEmail }).exec();
    if (!instructor) {
      throw new Error('Instructor not found');
    }

    // Find all students whose acceptedCourses intersect with the instructor's Teach_Courses
    const students = await this.UserModel
      .find({
        acceptedCourses: { $in: instructor.Teach_Courses },
      })
      .exec();

    return students;
  }
  // Method to create a course by the instructor
  async createCourse(
    createCourseDto: CreateCourseDto,
    instructorEmail: string,
  ): Promise<Course> {
    // Step 1: Find the instructor by their email (instructorEmail is obtained from JWT token)
    const instructor = await this.InstructorModel.findOne({
      email: instructorEmail,
    });

    if (!instructor) {
      throw new Error('Instructor not found');
    }

    // Step 3: Create the course with instructor's email and data
    const newCourse = new this.courseModel({
      ...createCourseDto, // All course data except instructor email
      instructormail: instructor.email, // Link course to instructor via email
      instructorName: instructor.name, // Optional: Add instructor's name to course
    });

    // Step 4: Save the course to the database
    const savedCourse = await newCourse.save();

    // Step 5: Add the new course to the instructor's Teach_Courses array
    instructor.Teach_Courses.push(savedCourse.title); // You can use the course title or ID here
    await instructor.save(); // Save the updated instructor document

    return savedCourse;
  }

  // Method to update a course, excluding the courseContent array
  async updateCourse(
    instructorEmail: string,
    courseTitle: string,
    updateCourseDto: UpdateCourseDto,
  ) {
    // Check if the instructor exists
    const instructor = await this.InstructorModel.findOne({
      email: instructorEmail,
    });
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    // Check if the course exists and belongs to the instructor (by email)
    const course = await this.courseModel.findOne({
      title: courseTitle,
      instructormail: instructorEmail,
    });
    if (!course) {
      throw new NotFoundException(
        'Course not found or you are not the instructor of this course',
      );
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

  async addCourseContent(
    instructorEmail: string,
    courseTitle: string,
    newContent: string[],
  ): Promise<Course> {
    // Find the course by title and instructor email
    const course = await this.courseModel.findOne({
      title: courseTitle,
    });

    if (!course) {
      throw new NotFoundException(
        'Course not found or you are not the instructor of this course',
      );
    }

    // Ensure newContent is an array before updating
    if (!Array.isArray(newContent)) {
      throw new Error('newContent must be an array');
    }

    // Push the new content to the courseContent array
    course.courseContent.push(...newContent);

    // Save the updated course, but exclude validation for fields like 'price'
    return await course.save({ validateModifiedOnly: true });
  }

  // Method to update the course content
  async updateCourseContent(
    instructorEmail: string,
    courseTitle: string,
    newContent: string[],
  ): Promise<Course> {
    // Find the instructor
    const instructor = await this.InstructorModel.findOne({
      email: instructorEmail,
    });
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    // Find the course by title and instructor email
    const course = await this.courseModel.findOne({
      title: courseTitle,
      instructormail: instructorEmail,
    });
    if (!course) {
      throw new NotFoundException(
        'Course not found or you are not the instructor of this course',
      );
    }

    // Update the course content (replace it with the new content)
    await this.courseModel.updateOne(
      { title: courseTitle, instructormail: instructorEmail },
      { $push: { courseContent: { $each: newContent } } },
    );

    // Save the updated course
    const updatedCourse = await course.save();

    return updatedCourse;
  }

  // Edit course content: Replace the current content with new content
  async editCourseContent(
    instructorEmail: string,
    courseTitle: string,
    newContent: string[],
  ): Promise<Course> {
    const course = await this.courseModel.findOne({
      title: courseTitle,
      instructormail: instructorEmail,
    });

    if (!course) {
      throw new NotFoundException(
        'Course not found or you are not the instructor of this course',
      );
    }

    // Replace the current content with the new content
    course.courseContent = newContent;

    // Save and return the updated course
    return await course.save();
  }

  // Delete specific content from course content array
  async deleteCourseContent(
    instructorEmail: string,
    courseTitle: string,
    contentToDelete: string[],
  ): Promise<Course> {
    const course = await this.courseModel.findOne({
      title: courseTitle,
      instructormail: instructorEmail,
    });

    if (!course) {
      throw new NotFoundException(
        'Course not found or you are not the instructor of this course',
      );
    }

    // Remove the specified content from the courseContent array
    course.courseContent = course.courseContent.filter(
      (content) => !contentToDelete.includes(content),
    );

    // Explicitly prevent price validation during this operation
    // This assumes the `price` field is not being updated, so it won't be validated

    // Save and return the updated course
    return await course.save({ validateModifiedOnly: true });
  }

  // Get all students enrolled in a course and their count
  async getEnrolledStudents(courseTitle: string): Promise<any> {
    const students = await this.UserModel.find({
      acceptedCourses: { $in: [courseTitle] },
    }).exec();

    return {
      totalCount: students.length, // Number of students
      students: students.map((student) => ({
        name: student.name,
        email: student.email,
        age: student.age,
        coursescores: student.courseScores,
        appliedCourses: student.appliedCourses,
      })),
    };
  }

  // 2. Get the number of students who have completed the course
  async getCompletedStudentsCount(courseTitle: string): Promise<number> {
    const progress = await this.progressModel
      .find({
        Coursetitle: courseTitle,
        completionRate: { $gte: 100 },
      })
      .exec();
    return progress.length;
  }

  // 3. Get the number of students based on their scores
  async getStudentsByScore(courseTitle: string): Promise<any> {
    // Find all students who are accepted into the course
    const students = await this.UserModel.find({
      acceptedCourses: { $in: [courseTitle] },
    }).exec();

    // Define score categories
    const scoreCategories = {
      belowAverage: 0,
      average: 0,
      aboveAverage: 0,
      excellent: 0,
    };

    // Get the total number of students in the course
    const totalStudents = students.length;

    // Calculate the average score for the course
    const averageScore = totalStudents
      ? students.reduce(
          (sum, student) =>
            sum +
            student.courseScores.find(
              (score) => score.courseTitle === courseTitle,
            )?.score,
          0,
        ) / totalStudents
      : 0;

    // Categorize students based on their score in the course
    students.forEach((student) => {
      const studentScore = student.courseScores.find(
        (score) => score.courseTitle === courseTitle,
      )?.score;

      if (studentScore !== undefined) {
        if (studentScore < averageScore) {
          scoreCategories.belowAverage += 1;
        } else if (studentScore === averageScore) {
          scoreCategories.average += 1;
        } else if (studentScore > averageScore) {
          scoreCategories.aboveAverage += 1;
        } else {
          scoreCategories.excellent += 1;
        }
      }
    });

    return scoreCategories;
  }

  // Method to get all courses taught by an instructor
  async getCoursesByInstructor(email: string): Promise<any[]> {
    console.log(`Searching for instructor with email: ${email}`);
    
    const instructor = await this.InstructorModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    }).exec();
    
    
    if (!instructor) {
      console.log(`Instructor not found for email: ${email}`);
      throw new NotFoundException(`Instructor with email ${email} not found`);
    }
  
    console.log(`Found instructor: ${instructor.name}`);
  
    const courses = await this.courseModel
      .find({ title: { $in: instructor.Teach_Courses } })
      .exec();
  
    console.log(`Courses found: ${courses.length}`);
    
    return courses.map((course) => ({
      title: course.title,
      instructor_name: instructor.name,
      price: course.price,
      image: course.image,
      category: course.category,
    }));
  }
  

  async findCourseByTitle(title: string): Promise<{
    course: {
      title: string;
      instructorName: string;
      description: string;
      category: string;
      difficultyLevel: string;
      totalClasses: number;
      courseContent: string[];
      notes: string[];
      image: string;
    };
  }> {
    const course = await this.courseModel.findOne({ title }).lean();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const courseDetails = {
      title: course.title,
      instructorName: course.instructorName || '', // Default to empty string if instructorName is not available
      description: course.description,
      category: course.category,
      difficultyLevel: course.difficultyLevel,
      totalClasses: course.totalClasses,
      courseContent: course.courseContent,
      notes: course.notes,
      image: course.image, // Assuming the image is stored in the "files" folder
    };

    return { course: courseDetails };
  }

  async getStudentsBycourses(email: string): Promise<{
    students: {
      email: string;
      name: string;
      age: string;
      profilePictureUrl?: string;
      acceptedCourses: string[];
      GPA: number;
    }[];
  }> {
    const instructor = await this.InstructorModel.findOne({ email });
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    const students = await this.UserModel.find({
      acceptedCourses: { $in: instructor.Teach_Courses },
    })
      .select('-progress -passwordHash')
      .lean();

    const updatedStudents = students.map((student) => ({
      ...student,
      profilePictureUrl: student.profilePictureUrl
    }));

    return { students: updatedStudents };
  }

  async getStudentProgressByEmail(email: string) {
    const progressData = await this.progressModel
      .find({ studentEmail: email })
      .exec();

    if (!progressData || progressData.length === 0) {
      throw new Error('No progress data found for this student');
    }

    // Format the response
    const formattedProgress = progressData.map((progress) => ({
      courseTitle: progress.Coursetitle,
      score: progress.score,
      completionRate: progress.completionRate,
      lastAccessed: progress.lastAccessed,
      completedLectures: progress.completedLectures || [], // Ensure it's an array if not defined
    }));

    return formattedProgress;
  }
  // Method to find an instructor by their ID
  async findInstructorById(instructorId: string): Promise<Instructor> {
    // Find the instructor by their ID
    const instructor = await this.InstructorModel.findById(instructorId).exec();
  
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${instructorId} not found`);
    }
  
    return instructor;
  }


// Method to find an instructor by their Email
async findInstructorByEmail(instructorEmail: string): Promise<Instructor> {
  // Find the instructor by their Email
  const instructor = await this.InstructorModel.findOne({instructorEmail}).exec();

  if (!instructor) {
    throw new NotFoundException(`Instructor with email ${instructorEmail} not found`);
  }

  return instructor;
}


async sendNotificationToStudentsByEmail(
  instructorEmail: string,
  courseTitle: string,
  notificationMessage: string,
): Promise<any> {  // Change return type to any or a specific object type if you prefer
  // Find the instructor by email
  const instructor = await this.InstructorModel.findOne({ email: instructorEmail });
  if (!instructor) {
    throw new NotFoundException('Instructor not found.');
  }

  // Check if the instructor teaches the course
  if (!instructor.Teach_Courses.includes(courseTitle)) {
    throw new BadRequestException('Instructor does not teach this course.');
  }

  // Find all students enrolled in the specified course
  const students = await this.UserModel.find({ acceptedCourses: courseTitle }, 'email');
  if (!students || students.length === 0) {
    throw new NotFoundException('No students found for this course.');
  }

  // Send notification to all students by their email
  const studentEmails = students.map((student) => student.email);
  await Promise.all(
    studentEmails.map((email) =>
      this.UserModel.updateOne(
        { email }, // Use email to find the student
        { $push: { Notifiction: notificationMessage } },
      ),
    ),
  );

  // Return a structured JSON response
  return { message: `Notification sent to all students in the course "${courseTitle}".` };
}



}
