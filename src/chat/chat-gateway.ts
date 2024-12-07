import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";


@WebSocketGateway(3002, {cors: {origin: '*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log('New user Connected..', client.id)

        client.broadcast.emit('user-joined', {
            message: `New user joined the chat: ${client.id}`,
        })
    }

    handleDisconnect(client: Socket) {
        console.log('User Disonnected..', client.id)

        this.server.emit('user-left', {
            message: `User left the chat: ${client.id}`,
        })
    }

    // Handle a client joining a room
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
        client.join(room); // The client joins0 the specified room
        console.log(`Client ${client.id} joined room ${room}`);
        this.server.to(room).emit('systemMessage', `User ${client.id} has joined the room.`);

    }
    

    // Handle a client leaving a room
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
        client.leave(room); // The client leaves the specified room
        console.log(`Client ${client.id} left room ${room}`);
        this.server.to(room).emit('systemMessage', `User ${client.id} has left the room.`);
    }

    // Handle sending a message to a specific room
    @SubscribeMessage('sendMessageToRoom')
    handleMessageToRoom(
        @MessageBody() data: { room: string; message: string },
        @ConnectedSocket() client: Socket
    ): void {
        const { room, message } = data;
        console.log(`Message to room ${room} from ${client.id}: ${message}`);
        this.server.to(room).emit('roomMessage', { sender: client.id, message }); // Broadcast to the room
    }

    // Handle new message (fallback or general usage)
    @SubscribeMessage('newMessage')
    handleNewMessage(@MessageBody() message: any, @ConnectedSocket() client: Socket): void {
        console.log(`Message from ${client.id}:`, message);

        // Emit a reply to the client
        client.emit('Reply', 'Ahla mesa aalek ya Geee');

        // Emit to all connected clients
        this.server.emit('Reply', 'Hello everyone!');
    }
}
    