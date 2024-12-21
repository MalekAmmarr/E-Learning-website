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
import { UsersService } from "src/Backend/users/users.service";
import { CoursesService } from "src/Backend/courses/courses.service";

@WebSocketGateway(3002, { cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(ChatService) private readonly chatService: ChatService,
    @Inject(UsersService) private readonly userService: UsersService, // Inject UserService
    @Inject(CoursesService) private readonly courseService: CoursesService // Inject CourseService
  ) {}

  @WebSocketServer() server: Server;

  // Track active users in course-specific rooms
  private rooms: { [courseId: string]: string[] } = {};

  handleConnection(client: Socket) {
    console.log(`Client: ${client.id} connected to chat`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client: ${client.id} disconnectedy`);
    Object.keys(this.rooms).forEach((courseId) => {
      this.rooms[courseId] = this.rooms[courseId].filter((id) => id !== client.id);
      this.server.to(courseId).emit("systemMessage", `User ${client.id} has left the chat.`);
    });
  }

  // Join a course-specific room
  @SubscribeMessage("joinRoom")
  async handleJoinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const courseId = data?.courseId?.trim();
      const userId = data?.userId?.trim();

      if (!courseId || !userId) {
        throw new Error("Missing courseId or userId.");
      }

      // Validate course and user
      const course = await this.courseService.findCourseById(courseId);
      console.log(course)
      const user = await this.userService.findUserById(userId);

      if (!course) {
        throw new Error(`Course with ID ${courseId} not found.`);
      }
      if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
      }
      if (!user.acceptedCourses.includes(courseId)) {
        throw new Error("User is not enrolled in this course.");
      }

      // Join the room
      client.join(courseId);

      // Fetch chat history
      const messages = await this.chatService.getMessagesHistory(courseId);

      if (!this.rooms[courseId]) this.rooms[courseId] = [];
      if (!this.rooms[courseId].includes(client.id)) this.rooms[courseId].push(client.id);

      console.log(`User ${userId} joined course room: ${courseId}`);
      client.emit("chatHistory", messages); // Send chat history to the user
      this.server.to(courseId).emit("systemMessage", `${user.name} has joined the chat.`);
    } catch (error) {
      console.error("Error in handleJoinRoom:", error.message);
      client.emit("error", { message: error.message });
    }
  }

  // Send a message to a course-specific room
  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const courseId = data?.courseId?.trim();
      const userId = data?.userId?.trim();
      const message = data?.message?.trim();

      if (!courseId || !userId || !message) {
        throw new Error("Missing courseId, userId, or message.");
      }

      // Validate user enrollment
      const user = await this.userService.findUserById(userId);

      if (!user || !user.acceptedCourses.includes(courseId)) {
        throw new Error("User is not enrolled in this course.");
      }

      // Save the message to the database
      await this.chatService.saveMessage(courseId, userId, user.name, message);

      console.log(`Message in course ${courseId} from ${userId}: ${message}`);
      this.server.to(courseId).emit("chatMessage", { user: user.name, message });
    } catch (error) {
      console.error("Error in handleSendMessage:", error.message);
      client.emit("error", { message: error.message });
    }
  }
}
