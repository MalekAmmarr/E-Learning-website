import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseSchema } from 'src/schemas/course.schema';

@Injectable()
export class CoursesService {
  [x: string]: any;
  constructor(
    @InjectModel(Course.name, 'eLearningDB')
    private readonly courseModel: Model<Course>,
  ) {}

  // Method to search for courses by title or instructor's email
  async searchCourses(query: string): Promise<Course[]> {
    const regex = new RegExp(query, 'i'); // Case-insensitive search
    return this.courseModel
      .find({
        $or: [
          { title: { $regex: regex } },
          { instructorName: { $regex: regex } },
        ],
      })
      .exec();
  }

  //used for Admins
  async viewCourses() {
    try {
      const courses = await this.courseModel.find();
      return courses;
    } catch (Error) {
      console.error('Error Fetching courses :', Error);
      throw new Error('Error Fetching courses');
    }
  }

  //ensure compliance with platform standards for Admins
  async updateCourses(
    courseId: string,
    updates: Record<string, any>,
  ): Promise<Course> {
    try {
      // Find and update the course
      const updatedCourse = await this.courseModel.findOneAndUpdate(
        { courseId }, // Query to find the course
        { $set: updates }, // Set only provided fields
        { new: true, runValidators: true }, // Return the updated document and validate
      );

      if (!updatedCourse) {
        throw new Error('Course not found');
      }

      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Error updating course');
    }
  }

  //Archive outdated Course
  async ArchiveCourse(courseId: string): Promise<Course> {
    try {
      const ArchiveCourse = await this.courseModel.findOneAndUpdate(
        { courseId },
        { isArchived: true },
        { new: true }, // Return the updated document
      );
      if (!ArchiveCourse) {
        throw new Error('Course not found');
      }
      return ArchiveCourse;
    } catch (error) {
      console.error('Error Archiving course:', error);
      throw new Error('Error Archivng course');
    }
  }

  //Delete outdated Course
  async DeleteCourse(title: string): Promise<Course> {
    try {
      const deletedCourse = await this.courseModel.findOneAndDelete({
        title: title,
      });

      if (!deletedCourse) {
        throw new Error('Course not found');
      }

      return deletedCourse;
    } catch (error) {
      console.error('Error deleting course:', error); // Log the error for debugging
      throw new Error('Error deleting course');
    }
  }

  async getCourseByTitle(courseTitle: string): Promise<Course> {
    return await this.courseModel.findOne({ title: courseTitle });
  }

  async findCourseById(courseId: string): Promise<Course> {
    try {
      const course = await this.courseModel
        .findOne({ courseId: courseId })
        .exec();
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found.`);
      }
      return course;
    } catch (error) {
      console.error('Error finding course by ID:', error);
      throw new Error('Error finding course.');
    }
  }
  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find();
  }
  async getAllCoursesTitle(): Promise<string[]> {
    const courses = await this.courseModel.find().select('title -_id').exec();
    return courses.map((course) => course.title);
  }
  async getAllCoursesByTitle(title: string): Promise<Course> {
    return await this.courseModel.findOne({ title });
  }
}
