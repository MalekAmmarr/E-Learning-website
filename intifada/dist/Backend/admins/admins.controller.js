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
exports.AdminsController = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("./admins.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const courses_service_1 = require("../courses/courses.service");
const logs_service_1 = require("../logs/logs.service");
let AdminsController = class AdminsController {
    constructor(adminsService, coursesService, logsService) {
        this.adminsService = adminsService;
        this.coursesService = coursesService;
        this.logsService = logsService;
    }
    async register(createAdminDto) {
        try {
            const admin = await this.adminsService.create(createAdminDto);
            return {
                message: 'Admin registered successfully',
                admin,
            };
        }
        catch (error) {
            console.error('Error during registration:', error);
            throw new common_1.BadRequestException('User registration failed');
        }
    }
    async login({ email, passwordHash }) {
        const login = await this.adminsService.login(email, passwordHash);
        const Logs = await this.logsService.create(email, login.log);
        return login;
    }
    async viewCourses() {
        return await this.coursesService.viewCourses();
    }
    async updateCourse(updateData) {
        const { courseId, updates } = updateData;
        try {
            const updatedCourse = await this.coursesService.updateCourses(courseId, updates);
            return {
                message: 'Course updated successfully',
                updatedCourse,
            };
        }
        catch (error) {
            console.error('Error during course update:', error);
            throw new common_1.BadRequestException('Course update failed');
        }
    }
    async archiveCourse(body) {
        const { courseId } = body;
        try {
            const archivedCourse = await this.coursesService.ArchiveCourse(courseId);
            return {
                message: 'Course archived successfully',
                archivedCourse,
            };
        }
        catch (error) {
            console.error('Error during course archiving:', error);
            throw new common_1.BadRequestException('Course archiving failed');
        }
    }
    async deleteCourse(body) {
        const { courseId } = body;
        try {
            const deletedCourse = await this.coursesService.DeleteCourse(courseId);
            return {
                message: 'Course deleted successfully',
                deletedCourse,
            };
        }
        catch (error) {
            console.error('Error during course deletion:', error);
            throw new common_1.BadRequestException('Course deletion failed');
        }
    }
};
exports.AdminsController = AdminsController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('viewCourses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "viewCourses", null);
__decorate([
    (0, common_1.Patch)('updateCourse'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Patch)('archiveCourse'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "archiveCourse", null);
__decorate([
    (0, common_1.Delete)('deleteCourse'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "deleteCourse", null);
exports.AdminsController = AdminsController = __decorate([
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [admins_service_1.AdminsService,
        courses_service_1.CoursesService,
        logs_service_1.LogsService])
], AdminsController);
//# sourceMappingURL=admins.controller.js.map