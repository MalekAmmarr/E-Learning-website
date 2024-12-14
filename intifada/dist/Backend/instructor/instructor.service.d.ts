import { Model } from 'mongoose';
import { Instructor } from 'src/schemas/Instructor.schema';
import { CreateInstructorDto } from './create-Ins.dto';
import { User } from 'src/schemas/user.schema';
import { Course } from 'src/schemas/course.schema';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { UpdateCourseDto } from '../courses/dto/update-course.dto';
export declare class InstructorService {
    private readonly InstructorModel;
    private readonly UserModel;
    private courseModel;
    constructor(InstructorModel: Model<Instructor>, UserModel: Model<User>, courseModel: Model<Course>);
    getUsersAppliedToCourses(email: string): Promise<(import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    create(createInstructorDto: CreateInstructorDto): Promise<Instructor>;
    login(email: string, passwordHash: string): Promise<{
        accessToken: string;
    }>;
    AcceptOrReject(email: string, courseName: string, action: 'accept' | 'reject'): Promise<String>;
    createCourse(createCourseDto: CreateCourseDto, instructorEmail: string): Promise<Course>;
    updateCourse(instructorEmail: string, courseTitle: string, updateCourseDto: UpdateCourseDto): Promise<import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    addCourseContent(instructorEmail: string, courseTitle: string, newContent: string[]): Promise<Course>;
    updateCourseContent(instructorEmail: string, courseTitle: string, newContent: string[]): Promise<Course>;
    editCourseContent(instructorEmail: string, courseTitle: string, newContent: string[]): Promise<Course>;
    deleteCourseContent(instructorEmail: string, courseTitle: string, contentToDelete: string[]): Promise<Course>;
}
