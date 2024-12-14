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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const admin_schema_1 = require("../../schemas/admin.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user_schema_1 = require("../../schemas/user.schema");
const instructor_schema_1 = require("../../schemas/instructor.schema");
const course_schema_1 = require("../../schemas/course.schema");
const logs_schema_1 = require("../../schemas/logs.schema");
let AdminsService = class AdminsService {
    constructor(courseModel, adminModel, InstructorModel, UserModel, logsModel) {
        this.courseModel = courseModel;
        this.adminModel = adminModel;
        this.InstructorModel = InstructorModel;
        this.UserModel = UserModel;
        this.logsModel = logsModel;
    }
    async create(createAdminDto) {
        try {
            if (!createAdminDto.passwordHash) {
                throw new Error("Password is required");
            }
            const hashedPassword = await bcrypt.hash(createAdminDto.passwordHash, 10);
            const admin = new this.adminModel({
                ...createAdminDto, passwordHash: hashedPassword
            });
            return await admin.save();
        }
        catch (error) {
            console.error('Error creating admin:', error);
            throw new Error('Admin registration failed');
        }
    }
    async login(email, passwordHash) {
        let log = "failed";
        const admin = await this.adminModel.findOne({ email }).exec();
        if (!admin) {
            const accessToken = "Invalid Credentials";
            return { accessToken, log };
        }
        console.log(admin);
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is missing!');
        }
        const isPasswordValid = await bcrypt.compare(passwordHash, admin.passwordHash);
        if (!isPasswordValid) {
            const accessToken = "Invalid Credentials";
            return { accessToken, log };
        }
        log = "pass";
        const payload = { name: admin.name, email: admin.email };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return { accessToken, log };
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name, 'eLearningDB')),
    __param(1, (0, mongoose_1.InjectModel)(admin_schema_1.admin.name, 'eLearningDB')),
    __param(2, (0, mongoose_1.InjectModel)(instructor_schema_1.Instructor.name, 'eLearningDB')),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name, 'eLearningDB')),
    __param(4, (0, mongoose_1.InjectModel)(logs_schema_1.Logs.name, 'eLearningDB')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminsService);
//# sourceMappingURL=admins.service.js.map