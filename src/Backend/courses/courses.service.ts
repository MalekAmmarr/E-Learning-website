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
}
