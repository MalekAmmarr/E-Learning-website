import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService {
  private rooms: { [room: string]: { users: string[]; messages: { user: string; text: string }[] } } = {};

  createRoom(room: string) {
    if (!this.rooms[room]) {
      this.rooms[room] = { users: [], messages: [] };
    }
  }

  joinRoom(room: string, user: string) {
    this.createRoom(room);
    if (!this.rooms[room].users.includes(user)) {
      this.rooms[room].users.push(user);
    }
  }

  leaveRoom(room: string, user: string) {
    if (this.rooms[room]) {
      this.rooms[room].users = this.rooms[room].users.filter((u) => u !== user);
    }
  }

  saveMessage(room: string, user: string, message: string) {
    this.createRoom(room);
    this.rooms[room].messages.push({ user, text: message });
    return { room, user, message };
  }

  getRoomMessages(room: string) {
    return this.rooms[room]?.messages || [];
  }
}
