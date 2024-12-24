// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { DiscussionGateway } from './DiscussionGateway';
// import { DiscussionService } from './DiscussionService';
// import { Thread, ThreadSchema } from 'src/schemas/threads.schema';
// import { Reply, ReplySchema } from 'src/schemas/reply.schema';
// import { Announcement, AnnouncementSchema } from 'src/schemas/announcement.schema';
// import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';
// import { InstructorService } from '../instructor/instructor.service';
// import { AuthService } from '../auth/auth.service';
// import { UsersService } from '../users/users.service';
// import { CoursesService } from '../courses/courses.service';
// import { AdminsModule } from '../admins/admins.module';
// import { admin, AdminSchema } from 'src/schemas/admin.schema';
// import { CoursesModule } from '../courses/courses.module';
// import { UsersModule } from '../users/users.module';
// import { Forum, ForumSchema } from 'src/schemas/forum.schema';


// @Module({
//   imports: [
//     MongooseModule.forFeature(
//       [
//         { name: Thread.name, schema: ThreadSchema },
//         { name: Reply.name, schema: ReplySchema },
//         { name: Announcement.name, schema: AnnouncementSchema },
//         { name: admin.name, schema: AdminSchema }, // Add Announcement schema
//         { name: Instructor.name, schema: InstructorSchema },
//         {name : Forum.name, schema : ForumSchema }
//       ],
//       'eLearningDB'
//     ),
//     CoursesModule,
//     UsersModule,
//     AdminsModule,
//   ],
//   providers: [DiscussionGateway, DiscussionService, CoursesService, InstructorService, UsersService, AuthService],
// })
// export class DiscussionModule {}
