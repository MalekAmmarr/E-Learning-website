import { Message } from './../../schemas/message.schema';
import { ChatHistory } from './../../schemas/chathistory.schema';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/schemas/course.schema';
import { Progress } from 'src/schemas/progress.schema';
import { User } from 'src/schemas/user.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { group } from 'console';


@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>,
    @InjectModel(Course.name, 'eLearningDB')
    private readonly courseModel: Model<Course>,
    @InjectModel(ChatHistory.name, 'eLearningDB')
    private readonly ChatHistoryModel: Model<ChatHistory>,
    @InjectModel(Message.name, 'eLearningDB')
    private readonly MessageModel: Model<Message>,
   
  ) {}

  // Method to search a student by email and return the student info and their course progress
  async CreateGroup(CreateGroupDto: CreateGroupDto) {
    const {
      Title,
      Admin,
      MembersEmail,
      MembersName,
      ProfilePictureUrl,
      messages,
      CourseTitle,
    } = CreateGroupDto;
    // Step 2: Validate members' eligibility
    const eligibleMembers = [];
    for (const email of MembersEmail) {
      const member = await this.userModel.findOne({ email });
      if (!member) {
        throw new NotFoundException(`Member with email ${email} not found.`);
      }

      if (!member.acceptedCourses.includes(CourseTitle)) {
        throw new BadRequestException(
          `Member ${email} is not enrolled in the ${CourseTitle} course as the creator.`,
        );
      }

      eligibleMembers.push(email);
    }
    if (eligibleMembers.length != MembersEmail.length) {
      throw new Error(`Members must take the ${CourseTitle} course  also`);
    }
    // Step 3: Create and save the group
    const newGroup = new this.ChatHistoryModel({
      Title,
      Admin,
      MembersEmail,
      MembersName,
      ProfilePictureUrl,
      messages,
      CourseTitle,
      timestamp: new Date(),
    });
    await newGroup.save();

    return {
      message: `${Title} Group created successfully`,
      group: newGroup,
      eligibleMembers,
    };
  }
  async getGroups(Admin: string, title: string) {
    const user = this.userModel.findOne({ email: Admin });
    if (!user) {
      throw new NotFoundException(`Member with email ${Admin} not found.`);
    }
    const Groups = await this.ChatHistoryModel.find(
      { Admin, CourseTitle: title },
      '-messages', // Exclude the 'messages' field
    ).exec();

    if (!Groups || Groups.length === 0) {
      throw new BadRequestException(
        `${Admin} hasn't entered any group in the ${title} course.`,
      );
    }

    return { Groups };
  }
  async getGroupChat(Admin: string, title: string) {
    const Groups = await this.ChatHistoryModel.findOne(
      { Admin, Title: title },
      'messages', // Include only the 'messages' field
    ).exec();

    return { Groups };
  }
  async sendMessage(
    sendMessageDto: SendMessageDto,

    CourseTitle: string,
    Title: string,
  ) {
    console.log('sendDto :', sendMessageDto);
    console.log('Course Title : ', CourseTitle);
    console.log('Title : ', Title);
    const Group = await this.ChatHistoryModel.findOne({
      CourseTitle: CourseTitle,
      Title: Title,
    });
    if (Group) {
      const message = new this.MessageModel({ ...sendMessageDto });
      Group.messages.push(message);
      await Group.save();
      // After saving the message, broadcast it to all connected clients
      
    } else throw new Error('No Group to Add on it your message');
  }
}
