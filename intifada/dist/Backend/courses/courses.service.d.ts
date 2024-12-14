import { Model } from 'mongoose';
import { Course } from 'src/schemas/course.schema';
export declare class CoursesService {
    private readonly courseModel;
    constructor(courseModel: Model<Course>);
}
