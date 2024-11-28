import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteModule } from './note/note.module';
import { InteractionModule } from './interaction/interaction.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AuthenticationLogModule } from './authentication-log/authentication-log.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { NotificationModule } from './notification/notification.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CertificateModule } from './certificate/certificate.module';
import { BackupModule } from './backup/backup.module';
import { ChathistoryModule } from './chathistory/chathistory.module';
import { EnrollementService } from './enrollement/enrollement.service';
import { EnrollementModule } from './enrollement/enrollement.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/E_Learning_Platform', {
    connectionName: 'eLearningDB',
  }),
  MongooseModule.forRoot('mongodb://localhost:27017/data_management', {
    connectionName: 'dataManagementDB',
  }),UsersModule, CoursesModule, ModulesModule, QuizzesModule, ProgressModule, NoteModule, InteractionModule, RecommendationModule, AuthenticationLogModule, ConfigurationModule, NotificationModule, FeedbackModule, CertificateModule, BackupModule, ChathistoryModule, EnrollementModule,],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
