import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Backend/users/users.module';
import { CoursesModule } from './Backend/courses/courses.module';
import { ModulesModule } from './Backend/modules/modules.module';
import { QuizzesModule } from './Backend/quizzes/quizzes.module';
import { ProgressModule } from './Backend/progress/progress.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteModule } from './Backend/note/note.module';
import { InteractionModule } from './Backend/interaction/interaction.module';
import { RecommendationModule } from './Backend/recommendation/recommendation.module';
import { AuthenticationLogModule } from './Backend/authentication-log/authentication-log.module';
import { ConfigurationModule } from './Backend/configuration/configuration.module';
import { NotificationModule } from './Backend/notification/notification.module';
import { FeedbackModule } from './Backend/feedback/feedback.module';
import { CertificateModule } from './Backend/certificate/certificate.module';
import { BackupModule } from './Backend/backup/backup.module';
import { ChathistoryModule } from './Backend/chathistory/chathistory.module';
import { EnrollementService } from './Backend/enrollement/enrollement.service';
import { EnrollementModule } from './Backend/enrollement/enrollement.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/E_Learning_Platform', {
      connectionName: 'eLearningDB',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/data_management', {
      connectionName: 'dataManagementDB',
    }),
    UsersModule,
    CoursesModule,
    ModulesModule,
    QuizzesModule,
    ProgressModule,
    NoteModule,
    InteractionModule,
    RecommendationModule,
    AuthenticationLogModule,
    ConfigurationModule,
    NotificationModule,
    FeedbackModule,
    CertificateModule,
    BackupModule,
    ChathistoryModule,
    EnrollementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
