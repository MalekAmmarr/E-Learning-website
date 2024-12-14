"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorModule = void 0;
const common_1 = require("@nestjs/common");
const instructor_controller_1 = require("./instructor.controller");
const mongoose_1 = require("@nestjs/mongoose");
const instructor_service_1 = require("./instructor.service");
const Instructor_schema_1 = require("../../schemas/Instructor.schema");
const user_schema_1 = require("../../schemas/user.schema");
const User_schema_1 = require("../../schemas/User.schema");
const course_schema_1 = require("../../schemas/course.schema");
let InstructorModule = class InstructorModule {
};
exports.InstructorModule = InstructorModule;
exports.InstructorModule = InstructorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: Instructor_schema_1.Instructor.name, schema: Instructor_schema_1.InstructorSchema },
                { name: User_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema }
            ], 'eLearningDB'),
        ],
        controllers: [instructor_controller_1.InstructorController],
        providers: [instructor_service_1.InstructorService],
    })
], InstructorModule);
//# sourceMappingURL=instructor.module.js.map