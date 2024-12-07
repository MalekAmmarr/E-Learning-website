import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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

    @SubscribeMessage('newMessage')
    handleNewMessage(client: Socket, message: any){
        console.log(message)

        client.emit('Reply','Ahla mesa aalek ya Geee')

        this.server.emit('Reply', 'Mesa Aal Kol')
    }
}