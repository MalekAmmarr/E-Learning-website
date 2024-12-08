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
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const logs_schema_1 = require("../../schemas/logs.schema");
let LogsService = class LogsService {
    constructor(LogsModel) {
        this.LogsModel = LogsModel;
    }
    async create(email, pass) {
        try {
            const log = new this.LogsModel({
                email, pass
            });
            return await log.save();
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Instructor registration failed');
        }
    }
    async getLogs() {
        try {
            const logs = await this.LogsModel.find();
            return logs;
        }
        catch (error) {
            console.error('Error fetching logs:', error);
            throw new Error('Error fetching logs');
        }
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(logs_schema_1.Logs.name, 'eLearningDB')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LogsService);
//# sourceMappingURL=logs.service.js.map