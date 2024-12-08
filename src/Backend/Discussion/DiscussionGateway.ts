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
  
    @SubscribeMessage('createThread')
    async handleCreateThread(
      @MessageBody() { courseId, title, content, createdBy }: { courseId: string; title: string; content: string; createdBy: string },
      @ConnectedSocket() client: Socket,
    ) {
      const thread = await this.discussionService.createThread(courseId, title, content, createdBy);
      this.server.emit('newThread', thread);
    }
  
    @SubscribeMessage('createReply')
    async handleCreateReply(
      @MessageBody() { threadId, content, createdBy }: { threadId: string; content: string; createdBy: string },
      @ConnectedSocket() client: Socket,
    ) {
      const reply = await this.discussionService.createReply(threadId, content, createdBy);
      this.server.to(threadId).emit('newReply', reply); // Send reply to all users in the thread room
    }
  
    @SubscribeMessage('getThreadReplies')
    async handleGetThreadReplies(
      @MessageBody() threadId: string,
      @ConnectedSocket() client: Socket,
    ) {
      const replies = await this.discussionService.getRepliesForThread(threadId);
      client.emit('threadReplies', replies); // Send replies to the requesting client
    }
  
    @SubscribeMessage('searchThreads')
    async handleSearchThreads(
      @MessageBody() query: string,
      @ConnectedSocket() client: Socket,
    ) {
      const threads = await this.discussionService.searchThreads(query);
      client.emit('searchResults', threads); // Send search results to the requesting client
    }
  }
  