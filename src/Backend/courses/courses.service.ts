import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseSchema } from 'src/schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name, 'eLearningDB')
    private readonly courseModel: Model<Course>,
  ) {}

  async searchCourses(query: string) {
    return this.courseModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Search by course title
        { category: { $regex: query, $options: 'i' } }, // Search by category/topic
        { instructorName: { $regex: query, $options: 'i' } }, // Search by instructor name
      ],
    });
  }


  //used for Admins
  async viewCourses (){
    try{
      const courses = await this.courseModel.find();
      return courses;
    }
    catch(Error){
      console.error('Error Fetching courses :', Error);
        throw new Error('Error Fetching courses');
    }
  }

  //ensure compliance with platform standards for Admins
  async updateCourses(courseId: string, updates: Record<string, any>): Promise<Course> {
    try {
      // Find and update the course
      const updatedCourse = await this.courseModel.findOneAndUpdate(
        { courseId }, // Query to find the course
        { $set: updates }, // Set only provided fields
        { new: true, runValidators: true } // Return the updated document and validate
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
async ArchiveCourse(courseId:string): Promise<Course>
{
  try{
      const ArchiveCourse = await this.courseModel.findOneAndUpdate(
        {courseId},
        {isArchived:true},
        { new: true } // Return the updated document
      )
      if (!ArchiveCourse) {
        throw new Error('Course not found');
      }
      return ArchiveCourse;
  }
  catch (error) {
    console.error('Error Archiving course:', error);
    throw new Error('Error Archivng course');
  }
}

//Delete outdated Course 

}
