import { Inject } from '@nestjs/common';
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
import { UsersService } from 'src/Backend/users/users.service';
import { InstructorService } from 'src/Backend/instructor/instructor.service';
import { CoursesService } from "src/Backend/courses/courses.service";


@WebSocketGateway(3003, { cors: { origin: "*" } })
export class DiscussionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService, // Inject UserService
    @Inject(InstructorService) private readonly instructorService: InstructorService,
    @Inject(DiscussionService) private readonly discussionService: DiscussionService, // Inject CourseService
    @Inject(CoursesService) private readonly courseService: CoursesService // Inject CourseService
  ) {}

  @WebSocketServer() server: Server;

    // Track active users in course-specific rooms
    private rooms: { [courseId: string]: string[] } = {};

  handleConnection(client: Socket) {
    console.log(`Client: ${client.id} connected to forum`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client: ${client.id} disconnected from forum`);
    Object.keys(this.rooms).forEach((courseId) => {
      this.rooms[courseId] = this.rooms[courseId].filter((id) => id !== client.id);
      this.server.to(courseId).emit("systemMessage", `User ${client.id} has left the chat.`);
    });
  }

  // Join a course room
  @SubscribeMessage('joinCourse')
  async handleJoinCourse(
    @MessageBody() data : any,
    @ConnectedSocket() client: Socket,
  ) {
    try{
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const courseId = data?.courseId?.trim();
      const userId = data?.userId?.trim();

      if (!courseId || !userId) {
        throw new Error("Missing courseId or userId.");
      }
      

      const course = await this.courseService.findCourseById(courseId);
      const user = await this.userService.findUserById(userId);
      if(!user){
        const instructor = await this.instructorService.findInstructorById(userId);
        if(!instructor){
          console.log("incorrect user")
        }
        if (!instructor?.Teach_Courses.includes(courseId)) {
          throw new Error('User is not enrolled in this course.');
        }
        client.join(`room:${courseId}`);
        this.server.to(`room:${courseId}`).emit('notification', `User ${instructor.name} joined the course.`);
      }
      if (!user?.acceptedCourses.includes(course.title)) {
        throw new Error('User is not enrolled in this course.');
      }
      
      client.join(`room:${courseId}`);
      this.server.to(`room:${courseId}`).emit('notification', `User ${user.name} joined the course.`);
      console.log(`user:${user.name} joined ${courseId}`)
      // // Fetch chat history
      // Fetch threads for the course
    const threads = await this.discussionService.getThreadsByCourse(courseId);

    // Fetch replies for each thread
    const threadsWithReplies = await Promise.all(
      threads.map(async (thread) => {
        const replies = await this.discussionService.getRepliesForThread(thread._id as string);
        return {
          ...thread.toObject(), // Convert Mongoose document to plain object
          replies,
        };
      }),
    );

    // Optionally fetch announcements or additional data if needed
    const announcements = await this.discussionService.getAnnouncementsByCourse(courseId);

    // Emit threads and related data to the user
    client.emit('courseData', {
      threads: threadsWithReplies,
      announcements,
    });
    console.log("Emitted course data:", JSON.stringify({
      threads: threadsWithReplies,
      announcements,
    }, null, 2)); 
      
      
    }
    catch (error) {
      console.error("Error in handleJoinRoom:", error.message);
      client.emit("error", { message: error.message });
    }
  }

@SubscribeMessage('createThread')
async handleCreateThread(
  @MessageBody() data : any,
  @ConnectedSocket() client: Socket,
) {
  try{
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    const courseId = data?.courseId?.trim();
    const title = data?.title?.trim();
    const content = data?.content?.trim();
    const createdBy = data?.createdBy?.trim();

  const thread = await this.discussionService.saveThread(courseId, title, content, createdBy);

  // Emit the new thread to all users in the room
  this.server.to(`room:${courseId}`).emit('newThread', {
    threadId: thread._id,
    title: thread.title,
    content: thread.content,
    createdAt: thread.createdAt,
    createdBy: thread.createdBy
  });
  

  }catch(error){
    console.error("Error in createThread:", error.message);
    client.emit("error", { message: error.message });
  }

}

@SubscribeMessage('createReply')
async handleCreateReply(
  @MessageBody() data : any,
  @ConnectedSocket() client: Socket,
) {
  try{

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    const courseId = data?.courseId?.trim();
    const title = data?.title?.trim();
    const threadId = data?.threadId.trim();
    const content = data?.content?.trim();
    const createdBy = data?.createdBy?.trim();
    const reply = await this.discussionService.saveReply(courseId, threadId, content, createdBy);

  // Emit the new reply to all users in the room
  this.server.to(`room:${courseId}`).emit('newReply', {

    replyId: reply._id,
    content: reply.content,
    createdBy: reply.createdBy,
    createdAt: reply.createdAt,
  });
  }
  catch(error){
    console.error("Error in createReply:", error.message);
    client.emit("error", { message: error.message });
  }

  
}

@SubscribeMessage('announce')
async handleAnnounce(
  @MessageBody() data : any,
  @ConnectedSocket() client: Socket,
) {
  try {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    const instructorId = data?.instructorId?.trim();
    const courseId = data?.courseId?.trim();
    const title = data?.title?.trim();
    const content = data?.content?.trim();
    
    const course = await this.courseService.findCourseById(courseId);
    // Validate instructor role
    const instructor = await this.instructorService.findInstructorById(instructorId);
    if (!instructor || !instructor.Teach_Courses.includes(course.title)) {
      throw new Error('Only instructors can make announcements for this course.');
    }

    // Save to database
    const announcement = await this.discussionService.saveAnnouncement(courseId, title, content, instructorId);

    // Broadcast to all users in the room
    this.server.to(`room:${courseId}`).emit('announcement', {
      title: announcement.title,
      content: announcement.content,
      createdAt: announcement.createdAt,
      instructor: announcement.createdBy,
    });
  } catch (error) {
    console.error("Error in Announce:", error.message);
    client.emit('error', { message: error.message });
  }
}

  // Get all threads for a course
  @SubscribeMessage('getThreads')
  async handleGetThreads(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try{
      const courseId = data?.courseId?.trim();

      const threads = await this.discussionService.getThreadsByCourse(courseId);
      client.emit('courseThreads', threads); // Send threads to the requesting client
    }
    catch(error){
      console.error("Error in getThreads:", error.message);
      client.emit('error', { message: error.message });
    }

    
  }
}
