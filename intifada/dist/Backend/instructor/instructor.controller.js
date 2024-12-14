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
exports.InstructorController = void 0;
const common_1 = require("@nestjs/common");
const instructor_service_1 = require("./instructor.service");
const create_Ins_dto_1 = require("./create-Ins.dto");
const common_2 = require("@nestjs/common");
const create_course_dto_1 = require("../courses/dto/create-course.dto");
const update_course_dto_1 = require("../courses/dto/update-course.dto");
const add_content_dto_1 = require("../courses/dto/add-content.dto");
const edit_content_dto_1 = require("../courses/dto/edit-content.dto");
const delete_content_dto_1 = require("../courses/dto/delete-content.dto");
let InstructorController = class InstructorController {
    constructor(instructorService) {
        this.instructorService = instructorService;
    }
    async register(createInstructorDto) {
        try {
            const Instructor = await this.instructorService.create(createInstructorDto);
            return {
                message: 'Instructor registered successfully',
                Instructor,
            };
        }
        catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }
    async login({ email, passwordHash }) {
        return await this.instructorService.login(email, passwordHash);
    }
    async getUsersAppliedToCourses(instructorEmail) {
        try {
            return await this.instructorService.getUsersAppliedToCourses(instructorEmail);
        }
        catch (error) {
            console.error('Error fetching users applied to courses:', error);
            if (error instanceof common_2.NotFoundException) {
                throw error;
            }
            throw new Error('An error occurred while fetching users.');
        }
    }
    async acceptOrRejectCourse(body) {
        const { email, courseName, action } = body;
        if (action !== 'accept' && action !== 'reject') {
            throw new common_1.BadRequestException('Action must be "accept" or "reject"');
        }
        const message = await this.instructorService.AcceptOrReject(email, courseName, action);
        return { message };
    }
    async createCourse(email, createCourseDto) {
        return this.instructorService.createCourse(createCourseDto, email);
    }
    async updateCourse(instructorEmail, courseTitle, updateCourseDto) {
        const updatedCourse = await this.instructorService.updateCourse(instructorEmail, courseTitle, updateCourseDto);
        return updatedCourse;
    }
    async addCourseContent(instructorEmail, courseTitle, addContentDto) {
        return await this.instructorService.addCourseContent(instructorEmail, courseTitle, addContentDto.newContent);
    }
    async editCourseContent(instructorEmail, courseTitle, editContentDto) {
        return await this.instructorService.editCourseContent(instructorEmail, courseTitle, editContentDto.newContent);
    }
    async deleteCourseContent(instructorEmail, courseTitle, deleteContentDto) {
        return await this.instructorService.deleteCourseContent(instructorEmail, courseTitle, deleteContentDto.contentToDelete);
    }
};
exports.InstructorController = InstructorController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_Ins_dto_1.CreateInstructorDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('applied-users/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getUsersAppliedToCourses", null);
__decorate([
    (0, common_1.Post)('accept-reject-course'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "acceptOrRejectCourse", null);
__decorate([
    (0, common_1.Post)(':email/create-course'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Put)(':instructorEmail/courses/:courseTitle'),
    __param(0, (0, common_1.Param)('instructorEmail')),
    __param(1, (0, common_1.Param)('courseTitle')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Put)(':instructorEmail/addcontent/:courseTitle'),
    __param(0, (0, common_1.Param)('instructorEmail')),
    __param(1, (0, common_1.Param)('courseTitle')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_content_dto_1.AddContentDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "addCourseContent", null);
__decorate([
    (0, common_1.Put)(':instructorEmail/courses/:courseTitle/editcontent'),
    __param(0, (0, common_1.Param)('instructorEmail')),
    __param(1, (0, common_1.Param)('courseTitle')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, edit_content_dto_1.EditContentDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "editCourseContent", null);
__decorate([
    (0, common_1.Delete)(':instructorEmail/courses/:courseTitle/deletecontent'),
    __param(0, (0, common_1.Param)('instructorEmail')),
    __param(1, (0, common_1.Param)('courseTitle')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, delete_content_dto_1.DeleteContentDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "deleteCourseContent", null);
exports.InstructorController = InstructorController = __decorate([
    (0, common_1.Controller)('instructor'),
    __metadata("design:paramtypes", [instructor_service_1.InstructorService])
], InstructorController);
//# sourceMappingURL=instructor.controller.js.map