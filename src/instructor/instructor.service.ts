import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/schemas/course.schema';
import { Instructor } from 'src/schemas/instructor.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class InstructorService {

    constructor(
        @InjectModel(Instructor.name, 'elearningDB') private readonly instructorModel: Model<Instructor>,
        @InjectModel(User.name, 'elearningDB') private readonly userModel: Model<User>,
        @InjectModel(Course.name, 'elearningDB') private readonly courseModel: Model<Course>,
      ) {}
    
      // Fetch all students who applied to the courses taught by a given instructor
      async getStudentsAppliedToInstructorCourses(instructorEmail: string) {
        // Find the instructor by email and get the list of courses they are teaching
        const instructor = await this.instructorModel.findOne({ email: instructorEmail });
    
        if (!instructor) {
          throw new Error('Instructor not found');
        }
    
        // Use aggregation to find students who have applied to these courses
        const students = await this.userModel.aggregate([
          {
            $match: {
              appliedCourses: { $in: instructor.courses }, // Match courses taught by instructor
            },
          },
          {
            $lookup: {
              from: 'courses', // Join with the Course collection
              localField: 'appliedCourses',
              foreignField: 'courseId',
              as: 'courseDetails',
            },
          },
          {
            $project: {
              name: 1,
              email: 1,
              appliedCourses: 1,
              courseDetails: { title: 1, courseId: 1 }, // Select relevant fields from course
            },
          },
        ]);
    
        return students;
      }
}
