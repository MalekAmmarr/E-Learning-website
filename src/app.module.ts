import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [UsersModule, CoursesModule, ModulesModule, QuizzesModule, ProgressModule, MongooseModule.forRoot('mongodb://localhost:27017/'),],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
