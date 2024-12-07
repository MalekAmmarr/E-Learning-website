import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";


@WebSocketGateway(3002)
export class ChatGateway {

    @WebSocketServer() server: Server;
    @SubscribeMessage('newMessage')
    handleNewMessage(client: Socket, message: any){
        console.log(message)

        client.emit('Reply','Ahla mesa aalek ya Geee')

        this.server.emit('Reply', '')
    }
}