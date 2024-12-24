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

@WebSocketGateway(3008, { cors: { origin: '*' } })
export class DiscussionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly threadService: ThreadService,
    private readonly replyService: ReplyService,
  ) {}

  // Called when a client connects
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Called when a client disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Joining a client to a specific forum room
  @SubscribeMessage('joinForum')
  handleJoinForum(@MessageBody() data: { forumId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.forumId); // Join the forum room identified by `forumId`
    console.log(`Client ${client.id} joined forum room: ${data.forumId}`);
    client.emit('joinedForum', { forumId: data.forumId });
  }

  // Leaving a client from a specific forum room
  @SubscribeMessage('leaveForum')
  handleLeaveForum(@MessageBody() data: { forumId: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.forumId); // Leave the forum room identified by `forumId`
    console.log(`Client ${client.id} left forum room: ${data.forumId}`);
    client.emit('leftForum', { forumId: data.forumId });
  }

  // Posting a new thread and notifying all clients in the forum room
  @SubscribeMessage('postThread')
  async handlePostThread(
    @MessageBody() data: { forumId: string; thread: any },
    @ConnectedSocket() client: Socket,
  ) {
    const thread = await this.threadService.createThread(data.thread);
    console.log(`New thread posted in forum room: ${data.forumId}`);
    client.to(data.forumId).emit('newThread', thread); // Broadcast to all clients in the forum room
  }

  // Posting a reply and notifying all clients in the thread room
  @SubscribeMessage('postReply')
  async handlePostReply(
    @MessageBody() data: { threadId: string; reply: any; forumId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const reply = await this.replyService.createReply(data.reply);
    console.log(`New reply posted in thread room: ${data.threadId}`);
    client.to(data.forumId).emit('newReply', reply); // Broadcast to all clients in the forum room
  }

  // Deleting a thread and notifying all clients in the forum room
  @SubscribeMessage('deleteThread')
  async handleDeleteThread(
    @MessageBody() data: { threadId: string; forumId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.threadService.deleteThread(data.threadId, data.userId);
    console.log(`Thread deleted in forum room: ${data.forumId}`);
    client.to(data.forumId).emit('threadDeleted', { threadId: data.threadId });
  }

  // Deleting a reply and notifying all clients in the thread room
  @SubscribeMessage('deleteReply')
  async handleDeleteReply(
    @MessageBody() data: { replyId: string; forumId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.replyService.deleteReply(data.replyId, data.userId);
    console.log(`Reply deleted in forum room: ${data.forumId}`);
    client.to(data.forumId).emit('replyDeleted', { replyId: data.replyId });
  }
}
