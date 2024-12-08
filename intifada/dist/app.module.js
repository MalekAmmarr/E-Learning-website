"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./Backend/users/users.module");
const courses_module_1 = require("./Backend/courses/courses.module");
const modules_module_1 = require("./Backend/modules/modules.module");
const quizzes_module_1 = require("./Backend/quizzes/quizzes.module");
const progress_module_1 = require("./Backend/progress/progress.module");
const mongoose_1 = require("@nestjs/mongoose");
const note_module_1 = require("./Backend/note/note.module");
const interaction_module_1 = require("./Backend/interaction/interaction.module");
const recommendation_module_1 = require("./Backend/recommendation/recommendation.module");
const authentication_log_module_1 = require("./Backend/authentication-log/authentication-log.module");
const configuration_module_1 = require("./Backend/configuration/configuration.module");
const notification_module_1 = require("./Backend/notification/notification.module");
const feedback_module_1 = require("./Backend/feedback/feedback.module");
const certificate_module_1 = require("./Backend/certificate/certificate.module");
const backup_module_1 = require("./Backend/backup/backup.module");
const chathistory_module_1 = require("./Backend/chathistory/chathistory.module");
const enrollement_module_1 = require("./Backend/enrollement/enrollement.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://Behz_92:Behz_9204@intifadaa-shard-00-00.69zq2.mongodb.net:27017,intifadaa-shard-00-01.69zq2.mongodb.net:27017,intifadaa-shard-00-02.69zq2.mongodb.net:27017/?replicaSet=atlas-lhst4z-shard-0&ssl=true&authSource=admin', {
                connectionName: 'eLearningDB',
            }),
            mongoose_1.MongooseModule.forRoot('mongodb://Behz_92:Behz_9204@intifadaa-shard-00-00.69zq2.mongodb.net:27017,intifadaa-shard-00-01.69zq2.mongodb.net:27017,intifadaa-shard-00-02.69zq2.mongodb.net:27017/?replicaSet=atlas-lhst4z-shard-0&ssl=true&authSource=admin', {
                connectionName: 'dataManagementDB',
            }),
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            modules_module_1.ModulesModule,
            quizzes_module_1.QuizzesModule,
            progress_module_1.ProgressModule,
            note_module_1.NoteModule,
            interaction_module_1.InteractionModule,
            recommendation_module_1.RecommendationModule,
            authentication_log_module_1.AuthenticationLogModule,
            configuration_module_1.ConfigurationModule,
            notification_module_1.NotificationModule,
            feedback_module_1.FeedbackModule,
            certificate_module_1.CertificateModule,
            backup_module_1.BackupModule,
            chathistory_module_1.ChathistoryModule,
            enrollement_module_1.EnrollementModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map