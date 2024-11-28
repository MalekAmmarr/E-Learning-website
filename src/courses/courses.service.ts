import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseSchema } from 'src/schemas/course.schema';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course.name, 'eLearningDB') private readonly courseModel: Model<Course>) {}
}
