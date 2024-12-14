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

@WebSocketGateway(3003, { cors: { origin: '*' } })
export class DiscussionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly discussionService: DiscussionService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected to forum: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected from forum: ${client.id}`);
  }

  // Join a course room
  @SubscribeMessage('joinCourse')
  async handleJoinCourse(
    @MessageBody() courseId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room:${courseId}`);
    console.log(`Client ${client.id} joined course room: room:${courseId}`);
    this.server.to(`room:${courseId}`).emit('notification', `User ${client.id} joined the course`);
  }

  // Create a new thread
  @SubscribeMessage('createThread')
  async handleCreateThread(
    @MessageBody() { courseId, title, content, createdBy }: { courseId: string; title: string; content: string; createdBy: string },
    @ConnectedSocket() client: Socket,
  ) {
    const thread = await this.discussionService.createThread(courseId, title, content, createdBy);
    this.server.to(`room:${courseId}`).emit('newThread', thread); // Notify users in the course
  }

  // Create a reply to a thread
  @SubscribeMessage('createReply')
  async handleCreateReply(
    @MessageBody() { threadId, content, createdBy, courseId }: { threadId: string; content: string; createdBy: string; courseId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const reply = await this.discussionService.createReply(threadId, content, createdBy);
    this.server.to(`room:${courseId}`).emit('newReply', reply); // Notify users in the course
  }

  // Announce to the course
  @SubscribeMessage('announce')
  async handleAnnounce(
    @MessageBody() { courseId, message }: { courseId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Announcement in course ${courseId}: ${message}`);
    this.server.to(`room:${courseId}`).emit('announcement', { message });
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
