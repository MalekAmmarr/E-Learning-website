import { Inject } from "@nestjs/common";
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
  } from "@nestjs/websockets";
  import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
  
  @WebSocketGateway(3002, { cors: { origin: "*" } })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
      @Inject(ChatService) private readonly chatService: ChatService, // Inject ChatService
    ) {}
  
    @WebSocketServer() server: Server;
  
    // Track active users in rooms
    private rooms: { [key: string]: string[] } = {};
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      Object.keys(this.rooms).forEach((room) => {
        this.rooms[room] = this.rooms[room].filter((id) => id !== client.id);
        this.server.to(room).emit("systemMessage", `User ${client.id} has left the room.`);
      });
    }
  
    // Join a query room
    @SubscribeMessage("joinRoom")
    async handleJoinRoom(
      @MessageBody() data:any,
      @ConnectedSocket() client: Socket
    ) {

      try{
        if(typeof data === 'string'){
          data= JSON.parse(data);
        }

        const room= data?.room?.trim();
        const message= data?.message?.trim();
        const user = client.id;
      
      
      client.join(room);

      const messages = await this.chatService.getMessagesHistory(room);


      if (!this.rooms[room]) this.rooms[room] = [];
      if (!this.rooms[room].includes(client.id)) this.rooms[room].push(client.id);
  
      console.log(`${user} joined room: ${room}`);
      this.server.to(room).emit("systemMessage", `${user} has joined Room ${room}`);
    }
    catch(error){
      console.log('Error Parsing',error);
      client.emit('error',{message:'failed to send message'});

    }
  }
    // Send message to a room
    @SubscribeMessage("sendMessage")
    async handleSendMessage(
      @MessageBody() data:any,
      @ConnectedSocket() client: Socket
    ) {

      try{
        if(typeof data === 'string'){
          data= JSON.parse(data);
        }

        const room= data?.room?.trim();
        const message= data?.message?.trim();
        const user = client.id;

        console.log(`Received ${message} from room ${room} `);
        console.log('User ID:', user);

  
      await this.chatService.saveMessage(room, user, message);

      console.log(`Message in room ${room} from ${user}: ${message}`);
      this.server.to(room).emit("chatMessage", `${user}: ${message}` );
    }
    catch(error){
      console.log('Error Parsing',error);
      client.emit('error',{message:'failed to send message'});

    }
  }
}
  