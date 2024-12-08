import { InstructorService } from './instructor.service';
import { Instructor } from 'src/schemas/Instructor.schema';
import { CreateInstructorDto } from './create-Ins.dto';
import { User } from 'src/schemas/User.schema';
import { Course } from 'src/schemas/course.schema';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { UpdateCourseDto } from '../courses/dto/update-course.dto';
import { AddContentDto } from '../courses/dto/add-content.dto';
import { EditContentDto } from '../courses/dto/edit-content.dto';
import { DeleteContentDto } from '../courses/dto/delete-content.dto';
export declare class InstructorController {
    private readonly instructorService;
    constructor(instructorService: InstructorService);
    register(createInstructorDto: CreateInstructorDto): Promise<{
        message: string;
        Instructor: Instructor;
    }>;
    login({ email, passwordHash }: {
        email: string;
        passwordHash: string;
    }): Promise<{
        accessToken: string;
    }>;
    getUsersAppliedToCourses(instructorEmail: string): Promise<(import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    acceptOrRejectCourse(body: {
        email: string;
        courseName: string;
        action: 'accept' | 'reject';
    }): Promise<Object>;
    createCourse(email: string, createCourseDto: CreateCourseDto): Promise<Course>;
    updateCourse(instructorEmail: string, courseTitle: string, updateCourseDto: UpdateCourseDto): Promise<import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    addCourseContent(instructorEmail: string, courseTitle: string, addContentDto: AddContentDto): Promise<Course>;
    editCourseContent(instructorEmail: string, courseTitle: string, editContentDto: EditContentDto): Promise<Course>;
    deleteCourseContent(instructorEmail: string, courseTitle: string, deleteContentDto: DeleteContentDto): Promise<Course>;
}
