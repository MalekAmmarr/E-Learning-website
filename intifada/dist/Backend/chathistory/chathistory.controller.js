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
exports.ChathistoryController = void 0;
const common_1 = require("@nestjs/common");
const chathistory_service_1 = require("./chathistory.service");
let ChathistoryController = class ChathistoryController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async saveMessage(messageData) {
        return this.chatService.saveMessage(messageData);
    }
    async getMessages(user1, user2) {
        return this.chatService.getMessagesBetweenUsers(user1, user2);
    }
};
exports.ChathistoryController = ChathistoryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChathistoryController.prototype, "saveMessage", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('user1')),
    __param(1, (0, common_1.Query)('user2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChathistoryController.prototype, "getMessages", null);
exports.ChathistoryController = ChathistoryController = __decorate([
    (0, common_1.Controller)('chathistory'),
    __metadata("design:paramtypes", [chathistory_service_1.ChathistoryService])
], ChathistoryController);
//# sourceMappingURL=chathistory.controller.js.map