"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsModule = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("./admins.service");
const admins_controller_1 = require("./admins.controller");
const mongoose_1 = require("@nestjs/mongoose");
const Instructor_schema_1 = require("../../schemas/Instructor.schema");
const user_schema_1 = require("../../schemas/user.schema");
const User_schema_1 = require("../../schemas/User.schema");
const admin_schema_1 = require("../../schemas/admin.schema");
const courses_service_1 = require("../courses/courses.service");
const course_schema_1 = require("../../schemas/course.schema");
const logs_schema_1 = require("../../schemas/logs.schema");
const logs_module_1 = require("../logs/logs.module");
const logs_service_1 = require("../logs/logs.service");
let AdminsModule = class AdminsModule {
};
exports.AdminsModule = AdminsModule;
exports.AdminsModule = AdminsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: admin_schema_1.admin.name, schema: admin_schema_1.AdminSchema },
                { name: Instructor_schema_1.Instructor.name, schema: Instructor_schema_1.InstructorSchema },
                { name: User_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema },
                { name: logs_schema_1.Logs.name, schema: logs_schema_1.LogsSchema }
            ], 'eLearningDB'),
            logs_module_1.LogsModule
        ],
        controllers: [admins_controller_1.AdminsController],
        providers: [admins_service_1.AdminsService, courses_service_1.CoursesService, logs_service_1.LogsService],
    })
], AdminsModule);
//# sourceMappingURL=admins.module.js.map