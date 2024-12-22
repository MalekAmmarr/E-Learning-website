import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { InstructorService } from "../instructor/instructor.service";
import { AuthService } from '../auth/auth.service';
import { AdminsModule } from '../admins/admins.module';
import { admin, AdminSchema } from 'src/schemas/admin.schema';
import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';
import { Group, GroupSchema } from 'src/schemas/group.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Message.name, schema: MessageSchema },
          { name: admin.name, schema: AdminSchema },
          { name: Instructor.name, schema: InstructorSchema },
          { name: Group.name, schema: GroupSchema }
        ],
          'eLearningDB' // Specify the connection name (use 'eLearningDB' as defined in AppModule)
        ),
        CoursesModule,
        UsersModule,
        AdminsModule
        
      
      ],
    providers: [ChatGateway, ChatService, CoursesService, UsersService, InstructorService, AuthService]
})
export class ChatModule {}