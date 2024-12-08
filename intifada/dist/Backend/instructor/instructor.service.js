"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Instructor_schema_1 = require("../../schemas/Instructor.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user_schema_1 = require("../../schemas/user.schema");
const course_schema_1 = require("../../schemas/course.schema");
let InstructorService = class InstructorService {
    constructor(InstructorModel, UserModel, courseModel) {
        this.InstructorModel = InstructorModel;
        this.UserModel = UserModel;
        this.courseModel = courseModel;
    }
    async getUsersAppliedToCourses(email) {
        const instructor = await this.InstructorModel.findOne({
            email,
        }).exec();
        if (!instructor) {
            throw new common_1.NotFoundException(` cannot find this Instructor email: ${instructor}`);
        }
        const teachCourses = instructor.Teach_Courses;
        const users = await this.UserModel.find({
            appliedCourses: { $in: teachCourses },
        });
        return users;
    }
    async create(createInstructorDto) {
        try {
            if (!createInstructorDto.passwordHash) {
                throw new Error('Password is required');
            }
            const hashedPassword = await bcrypt.hash(createInstructorDto.passwordHash, 10);
            const user = new this.InstructorModel({
                ...createInstructorDto,
                passwordHash: hashedPassword,
            });
            return await user.save();
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Instructor registration failed');
        }
    }
    async login(email, passwordHash) {
        const Instructor = await this.InstructorModel.findOne({ email }).exec();
        if (!Instructor) {
            throw new common_1.NotFoundException('Instrutor not found');
        }
        console.log(Instructor);
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is missing!');
        }
        const isPasswordValid = await bcrypt.compare(passwordHash, Instructor.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const payload = { name: Instructor.name, email: Instructor.email };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return { accessToken };
    }
    async AcceptOrReject(email, courseName, action) {
        try {
            const user = await this.UserModel.findOne({ email });
            if (!user) {
                throw new Error(`User with email ${email} not found.`);
            }
            const courseIndex = user.appliedCourses.indexOf(courseName);
            if (courseIndex === -1) {
                throw new Error(`Course ${courseName} not found in appliedCourses.`);
            }
            user.appliedCourses.splice(courseIndex, 1);
            if (action === 'accept') {
                if (!user.acceptedCourses.includes(courseName)) {
                    user.acceptedCourses.push(courseName);
                    user.Notifiction
                        .push(`Congratulations! You have been accepted into the course  ${courseName}.
             We are excited to have you join and look forward to your participation. Please check the course details 
             in your dashboard for further instructions. Best of luck with your studies!`);
                }
            }
            else {
                user.Notifiction
                    .push(`Unfortunately, your application for the course ${courseName} has been rejected. 
          We appreciate your interest and encourage you to apply for other courses in the future. 
          Feel free to explore more options in your dashboard. Best wishes for your learning journey!`);
            }
            await user.save();
            return `Successfully ${action === 'accept' ? 'accepted' : 'rejected'} course ${courseName} for user ${email}.`;
        }
        catch (error) {
            console.error(`Error in AcceptOrReject: ${error.message}`);
            throw error;
        }
    }
    async createCourse(createCourseDto, instructorEmail) {
        const instructor = await this.InstructorModel.findOne({ email: instructorEmail });
        if (!instructor) {
            throw new Error('Instructor not found');
        }
        const newCourse = new this.courseModel({
            ...createCourseDto,
            instructormail: instructor.email,
            instructorName: instructor.name,
        });
        const savedCourse = await newCourse.save();
        instructor.Teach_Courses.push(savedCourse.title);
        await instructor.save();
        return savedCourse;
    }
    async updateCourse(instructorEmail, courseTitle, updateCourseDto) {
        const instructor = await this.InstructorModel.findOne({ email: instructorEmail });
        if (!instructor) {
            throw new common_1.NotFoundException('Instructor not found');
        }
        const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });
        if (!course) {
            throw new common_1.NotFoundException('Course not found or you are not the instructor of this course');
        }
        const { courseContent, ...updateData } = updateCourseDto;
        const updatedCourse = await this.courseModel.findOneAndUpdate({ title: courseTitle, instructormail: instructorEmail }, updateData, { new: true });
        return updatedCourse;
    }
    async addCourseContent(instructorEmail, courseTitle, newContent) {
        const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });
        if (!course) {
            throw new common_1.NotFoundException('Course not found or you are not the instructor of this course');
        }
        if (!Array.isArray(newContent)) {
            throw new Error('newContent must be an array');
        }
        course.courseContent.push(...newContent);
        return await course.save();
    }
    async updateCourseContent(instructorEmail, courseTitle, newContent) {
        const instructor = await this.InstructorModel.findOne({ email: instructorEmail });
        if (!instructor) {
            throw new common_1.NotFoundException('Instructor not found');
        }
        const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });
        if (!course) {
            throw new common_1.NotFoundException('Course not found or you are not the instructor of this course');
        }
        await this.courseModel.updateOne({ title: courseTitle, instructormail: instructorEmail }, { $push: { courseContent: { $each: newContent } } });
        const updatedCourse = await course.save();
        return updatedCourse;
    }
    async editCourseContent(instructorEmail, courseTitle, newContent) {
        const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });
        if (!course) {
            throw new common_1.NotFoundException('Course not found or you are not the instructor of this course');
        }
        course.courseContent = newContent;
        return await course.save();
    }
    async deleteCourseContent(instructorEmail, courseTitle, contentToDelete) {
        const course = await this.courseModel.findOne({ title: courseTitle, instructormail: instructorEmail });
        if (!course) {
            throw new common_1.NotFoundException('Course not found or you are not the instructor of this course');
        }
        course.courseContent = course.courseContent.filter(content => !contentToDelete.includes(content));
        return await course.save();
    }
};
exports.InstructorService = InstructorService;
exports.InstructorService = InstructorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Instructor_schema_1.Instructor.name, 'eLearningDB')),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name, 'eLearningDB')),
    __param(2, (0, mongoose_1.InjectModel)(course_schema_1.Course.name, 'eLearningDB')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], InstructorService);
//# sourceMappingURL=instructor.service.js.map