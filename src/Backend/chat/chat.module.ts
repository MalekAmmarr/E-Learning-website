import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { AdminsModule } from '../admins/admins.module';
import { admin, AdminSchema } from 'src/schemas/admin.schema';
import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';

@Module({
    imports: [
        MongooseModule.forFeature( [{ name: Message.name, schema: MessageSchema },
          { name: admin.name, schema: AdminSchema },
          { name: Instructor.name, schema: InstructorSchema }
        ],
          'eLearningDB' // Specify the connection name (use 'eLearningDB' as defined in AppModule)
        ),
        CoursesModule,
        UsersModule,
        AdminsModule
        
      
      ],
    providers: [ChatGateway, ChatService, CoursesService, UsersService,AuthService]
})
export class ChatModule {}