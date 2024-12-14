import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CoursesService } from '../courses/courses.service';
import { Course } from 'src/schemas/course.schema';
import { LogsService } from '../logs/logs.service';
export declare class AdminsController {
    private readonly adminsService;
    private readonly coursesService;
    private readonly logsService;
    constructor(adminsService: AdminsService, coursesService: CoursesService, logsService: LogsService);
    register(createAdminDto: CreateAdminDto): Promise<{
        message: string;
        admin: import("../../schemas/admin.schema").admin;
    }>;
    login({ email, passwordHash }: {
        email: string;
        passwordHash: string;
    }): Promise<{
        accessToken: string;
        log: string;
    }>;
    viewCourses(): Promise<(import("mongoose").Document<unknown, {}, Course> & Course & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    updateCourse(updateData: {
        courseId: string;
        updates: Record<string, any>;
    }): Promise<{
        message: string;
        updatedCourse: Course;
    }>;
    archiveCourse(body: {
        courseId: string;
    }): Promise<{
        message: string;
        archivedCourse: Course;
    }>;
    deleteCourse(body: {
        courseId: string;
    }): Promise<{
        message: string;
        deletedCourse: Course;
    }>;
}
