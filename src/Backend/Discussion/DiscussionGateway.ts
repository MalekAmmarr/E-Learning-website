import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DiscussionService } from './DiscussionService';
import { UsersService } from 'src/Backend/users/users.service';
import { InstructorService } from 'src/Backend/instructor/instructor.service';

@WebSocketGateway(3003, { cors: { origin: "*" } })
export class DiscussionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService, // Inject UserService
    @Inject(InstructorService) private readonly instructorService: InstructorService,
    @Inject(DiscussionService) private readonly discussionService: DiscussionService // Inject CourseService
  ) {}

  @WebSocketServer() server: Server;

    // Track active users in course-specific rooms
    private rooms: { [courseId: string]: string[] } = {};

  handleConnection(client: Socket) {
    console.log(`Client: ${client.id} connected to forum`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client: ${client.id} disconnected from forum`);
    Object.keys(this.rooms).forEach((courseId) => {
      this.rooms[courseId] = this.rooms[courseId].filter((id) => id !== client.id);
      this.server.to(courseId).emit("systemMessage", `User ${client.id} has left the chat.`);
    });
  }

  // Join a course room
@SubscribeMessage('joinCourse')
async handleJoinCourse(
  @MessageBody() { courseId, userId }: { courseId: string; userId: string },
  @ConnectedSocket() client: Socket,
) {
  const user = await this.userService.findUserById(userId);
  const instructor = await this.instructorService.findInstructorById(userId);

  if (!user?.acceptedCourses.includes(courseId) && !instructor?.Teach_Courses.includes(courseId)) {
    throw new Error('User is not enrolled in this course.');
  }

  client.join(`room:${courseId}`);
  this.server.to(`room:${courseId}`).emit('notification', `User ${user.name || instructor.name} joined the course.`);
}

@SubscribeMessage('createThread')
async handleCreateThread(
  @MessageBody() { courseId, title, content, createdBy }: { courseId: string; title: string; content: string; createdBy: string },
  @ConnectedSocket() client: Socket,
) {
  const thread = await this.discussionService.createThread(courseId, title, content, createdBy);

  // Emit the new thread to all users in the room
  this.server.to(`room:${courseId}`).emit('newThread', {
    threadId: thread._id,
    title: thread.title,
    content: thread.content,
    createdBy: thread.createdBy,
    createdAt: thread.createdAt,
  });
}

@SubscribeMessage('createReply')
async handleCreateReply(
  @MessageBody() { threadId, content, createdBy, courseId }: { threadId: string; content: string; createdBy: string; courseId: string },
  @ConnectedSocket() client: Socket,
) {
  const reply = await this.discussionService.createReply(threadId, content, createdBy);

  // Emit the new reply to all users in the room
  this.server.to(`room:${courseId}`).emit('newReply', {
    replyId: reply._id,
    threadId: reply.threadId,
    content: reply.content,
    createdBy: reply.createdBy,
    createdAt: reply.createdAt,
  });
}

  @SubscribeMessage('announce')
async handleAnnounce(
  @MessageBody() { courseId, title, content, instructorId }: { courseId: string; title: string; content: string; instructorId: string },
  @ConnectedSocket() client: Socket,
) {
  try {
    // Validate instructor role
    const instructor = await this.instructorService.findInstructorById(instructorId);
    if (!instructor || !instructor.Teach_Courses.includes(courseId)) {
      throw new Error('Only instructors can make announcements for this course.');
    }

    // Save to database
    const announcement = await this.discussionService.saveAnnouncement(courseId, title, content, instructor.name);

    // Broadcast to all users in the room
    this.server.to(`room:${courseId}`).emit('announcement', {
      title: announcement.title,
      content: announcement.content,
      createdAt: announcement.createdAt,
      instructor: instructor.name,
    });
  } catch (error) {
    client.emit('error', { message: error.message });
  }
}

  // Get all threads for a course
  @SubscribeMessage('getThreads')
  async handleGetThreads(
    @MessageBody() courseId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const threads = await this.discussionService.getThreadsByCourse(courseId);
    client.emit('courseThreads', threads); // Send threads to the requesting client
  }
}
