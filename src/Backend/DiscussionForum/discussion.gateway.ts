import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { ThreadService } from '../threads/thread.service';
  import { ReplyService } from '../replies/reply.service';
  

  @WebSocketGateway(3008, { cors: { origin: "*" } })
  export class DiscussionGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
      private readonly threadService: ThreadService,
      private readonly replyService: ReplyService,
    ) {}
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('joinForum')
    handleJoinForum(@MessageBody() data: { forumId: string }, @ConnectedSocket() client: Socket) {
      client.join(data.forumId);
      client.emit('joinedForum', { forumId: data.forumId });
    }
  
    @SubscribeMessage('postThread')
    async handlePostThread(
      @MessageBody() data: { forumId: string; thread: any },
      @ConnectedSocket() client: Socket,
    ) {
      const thread = await this.threadService.createThread(data.thread);
      client.to(data.forumId).emit('newThread', thread);
    }
  
    @SubscribeMessage('postReply')
    async handlePostReply(
      @MessageBody() data: { threadId: string; reply: any },
      @ConnectedSocket() client: Socket,
    ) {
      const reply = await this.replyService.createReply(data.reply);
      client.to(data.threadId).emit('newReply', reply);
    }
  
    @SubscribeMessage('deleteThread')
    async handleDeleteThread(
      @MessageBody() data: { threadId: string; userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      await this.threadService.deleteThread(data.threadId, data.userId);
      client.to(data.threadId).emit('threadDeleted', { threadId: data.threadId });
    }
  
    @SubscribeMessage('deleteReply')
    async handleDeleteReply(
      @MessageBody() data: { replyId: string; userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      await this.replyService.deleteReply(data.replyId, data.userId);
      client.to(data.replyId).emit('replyDeleted', { replyId: data.replyId });
    }
  }