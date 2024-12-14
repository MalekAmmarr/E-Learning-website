import { CreateAdminDto } from './dto/create-admin.dto';
import { Model } from 'mongoose';
import { admin } from 'src/schemas/admin.schema';
import { User } from 'src/schemas/user.schema';
import { Instructor } from 'src/schemas/instructor.schema';
import { Course } from 'src/schemas/course.schema';
import { Logs } from 'src/schemas/logs.schema';
export declare class AdminsService {
    private readonly courseModel;
    private readonly adminModel;
    private readonly InstructorModel;
    private readonly UserModel;
    private readonly logsModel;
    constructor(courseModel: Model<Course>, adminModel: Model<admin>, InstructorModel: Model<Instructor>, UserModel: Model<User>, logsModel: Model<Logs>);
    create(createAdminDto: CreateAdminDto): Promise<admin>;
    login(email: string, passwordHash: string): Promise<{
        accessToken: string;
        log: string;
    }>;
}
