import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/schemas/course.schema';
import { Progress } from 'src/schemas/progress.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ProgressService {
    constructor(
        @InjectModel(User.name, 'eLearningDB') private readonly userModel: Model<User>,
        @InjectModel(Course.name, 'eLearningDB') private readonly courseModel: Model<Course>,
        @InjectModel(Progress.name, 'eLearningDB') private readonly progressModel: Model<Progress>
      ) {}
    
      // Method to search a student by email and return the student info and their course progress
      async getStudentProgress(instructorEmail: string, studentEmail: string) {
        // Find the student by email
        const user = await this.userModel.findOne({ email: studentEmail }).exec();
        if (!user) {
          throw new NotFoundException('Student not found');
        }
    
        // Find all the courses taught by the instructor
        const courses = await this.courseModel
          .find({ instructormail: instructorEmail })
          .exec();
        if (!courses.length) {
          throw new NotFoundException('No courses found for this instructor');
        }
    
        // Get the progress of the student in each of these courses
        const progressData = await this.progressModel
          .find({
            studentEmail: studentEmail,
            Coursetitle: { $in: courses.map(course => course.title) },
          })
          .exec();
        if (!progressData.length) {
          throw new NotFoundException('No progress data found for this student');
        }
    
        // Format the data
        const studentProgress = progressData.map(progress => ({
          courseTitle: progress.Coursetitle,
          score: progress.score,
          completionRate: progress.completionRate,
          completedLectures: progress.completedLectures,
        }));
    
        // Prepare the response
        return {
          email: user.email,
          name: user.name,
          age: user.age,
          profilePictureUrl: user.profilePictureUrl || null,
          acceptedCourses: user.acceptedCourses,
          progress: studentProgress,
        };
      }
}
