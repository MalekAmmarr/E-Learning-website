import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseModule } from './response/response.module';
import { NoteModule } from './note/note.module';
import { InteractionModule } from './interaction/interaction.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AuthenticationLogModule } from './authentication-log/authentication-log.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { NotificationModule } from './notification/notification.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CertificateModule } from './certificate/certificate.module';


@Module({
  imports: [UsersModule, CoursesModule, ModulesModule, QuizzesModule, ProgressModule, MongooseModule.forRoot('mongodb://localhost:27017/'), ResponseModule, NoteModule, InteractionModule, RecommendationModule, AuthenticationLogModule, ConfigurationModule, NotificationModule, FeedbackModule, CertificateModule,],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
