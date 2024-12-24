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
import { Instructor } from 'src/schemas/instructor.schema';

import { ST } from 'next/dist/shared/lib/utils';

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
    @InjectModel(Instructor.name, 'eLearningDB')
    private readonly InstructorModel: Model<Instructor>,
  ) {}

  // Method to search a student by email and return the student info and their course progress
  async CreateGroup(
    CreateGroupDto: CreateGroupDto,
    StudentOrInstructor: string,
  ) {
    const {
      Title,
      Admin,
      MembersEmail,
      MembersName,
      ProfilePictureUrl,
      messages,
      CourseTitle,
      privacy,
    } = CreateGroupDto;
    if (privacy === 'public') {
      // Step 2: Validate members' eligibility
      MembersEmail.push(Admin);
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
        MembersEmail: eligibleMembers,
        MembersName,
        ProfilePictureUrl,
        messages,
        CourseTitle,
        timestamp: new Date(),
        privacy: 'public',
      });
      await newGroup.save();

      return {
        message: `${Title} Group created successfully`,
        group: newGroup,
        eligibleMembers,
      };
    } else {
      // Step 2: Validate members' eligibility
      MembersEmail.push(Admin);
      console.log('INstructor or student : ', StudentOrInstructor);
      if (StudentOrInstructor == 'Student') {
        const user = await this.userModel.findOne({ email: MembersEmail[0] });
        if (!user) {
          throw new Error(`user must take the ${CourseTitle} course  also`);
        } // Step 3: Create and save the group
        const newGroup = new this.ChatHistoryModel({
          Title: user.name,
          Admin,
          MembersEmail,
          MembersName,
          ProfilePictureUrl: user?.profilePictureUrl,
          messages,
          CourseTitle,
          timestamp: new Date(),
          privacy: 'private',
        });
        await newGroup.save();
        return {
          message: `${Title} Group created successfully`,
          group: newGroup,
        };
      } else {
        const Instructor = await this.InstructorModel.findOne({
          email: MembersEmail[0],
        });
        if (!Instructor) {
          throw new Error(
            `Instructor must Teach the ${CourseTitle} course  also`,
          );
        }
        const TeachCourse = Instructor?.Teach_Courses.includes(CourseTitle);
        if (TeachCourse) {
          const newGroup = new this.ChatHistoryModel({
            Title: Instructor.name,
            Admin,
            MembersEmail,
            MembersName,
            ProfilePictureUrl: Instructor.profilePictureUrl,
            messages,
            CourseTitle,
            timestamp: new Date(),
            privacy: 'private',
          }); // Step 3: Create and save the group
          await newGroup.save();
          return {
            message: `${Title} Group created successfully`,
            group: newGroup,
          };
        } else
          throw new Error(
            `Instructor must Teach the ${CourseTitle} course  also`,
          );
      }
    }
  }
  async getGroups(Admin: string, title: string, privacy: string) {
    const user = this.userModel.findOne({ email: Admin });
    if (!user) {
      throw new NotFoundException(`Member with email ${Admin} not found.`);
    }
    const Groups = await this.ChatHistoryModel.find(
      { MembersEmail: { $in: [Admin] }, CourseTitle: title, privacy: privacy },
      '-messages', // Exclude the 'messages' field
    ).exec();
    console.log(Admin, '  ', title, ' ', privacy);

    if (!Groups || Groups.length === 0) {
      throw new BadRequestException(
        `${Admin} hasn't entered any group in the ${title} course.`,
      );
    }

    return { Groups };
  }
  async getPrivateInstructorGroups(
    Admin: string,
    title: string,
    privacy: string,
  ) {
    const Instructor = this.InstructorModel.findOne({ email: Admin });
    if (!Instructor) {
      throw new NotFoundException(`Member with email ${Admin} not found.`);
    }
    const Groups = await this.ChatHistoryModel.find(
      { MembersEmail: { $in: [Admin] }, CourseTitle: title, privacy: privacy },
      '-messages', // Exclude the 'messages' field
    ).exec();
    console.log(Admin, '  ', title, ' ', privacy);

    if (!Groups || Groups.length === 0) {
      throw new BadRequestException(
        `${Admin} hasn't entered any group in the ${title} course.`,
      );
    }

    return { Groups };
  }
  async getInstructorGroups(Admin: string, title: string, privacy: string) {
    const admin = this.InstructorModel.findOne({ email: Admin });
    if (!admin) {
      throw new NotFoundException(`Member with email ${Admin} not found.`);
    }
    const Groups = await this.ChatHistoryModel.find(
      {
        MembersEmail: { $in: [Admin] },
        CourseTitle: title,
        isDiscusForum: true,
      },
      '-messages', // Exclude the 'messages' field
    ).exec();
    console.log(Admin, '  ', title, ' ', privacy);

    if (!Groups || Groups.length === 0) {
      throw new BadRequestException(
        `${Admin} hasn't entered any Discussion Forum in the ${title} course.`,
      );
    }

    return { Groups };
  }
  async getGroupChat(Admin: string, title: string) {
    const Groups = await this.ChatHistoryModel.findOne(
      { MembersEmail: { $in: [Admin] }, Title: title },
      'messages', // Include only the 'messages' field
    ).exec();
    console.log(Admin);
    console.log('Groups : ', Groups);
    console.log(title);
    return { Groups };
  }
  async getInstructorGroupChat(Admin: string, title: string) {
    const Groups = await this.ChatHistoryModel.findOne(
      { MembersEmail: { $in: [Admin] }, Title: title, isDiscusForum: true },
      'messages', // Include only the 'messages' field
    ).exec();
    console.log(Admin);
    console.log('Groups : ', Groups);
    console.log(title);
    return { Groups };
  }
  async getPrivateInstructorGroupChat(Admin: string, title: string) {
    const Groups = await this.ChatHistoryModel.findOne(
      { MembersEmail: { $in: [Admin] }, Title: title, privacy: 'private' },
      'messages', // Include only the 'messages' field
    ).exec();
    console.log(Admin);
    console.log('Groups : ', Groups);
    console.log(title);
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

  //
  async CreateGroupsDiscussions(CreateGroupDto: CreateGroupDto) {
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
    MembersEmail.push(Admin);
    // Step 2: Fetch students who have accepted the course
    const students = await this.userModel.find({
      acceptedCourses: CourseTitle,
    });
    const studentsEmails = students.map((student) => student.email);
    const studentsNames = students.map((student) => student.name);
    studentsEmails.push(Admin);
    // Step 3: Create and save the group
    const newGroup = new this.ChatHistoryModel({
      Title,
      Admin,
      MembersEmail: studentsEmails,
      MembersName: studentsNames,
      ProfilePictureUrl,
      messages,
      CourseTitle,
      timestamp: new Date(),
      isDiscusForum: true,
    });
    await newGroup.save();

    return {
      message: `${Title} Group created successfully`,
      group: newGroup,
    };
  }

  async getGroupChatByTitleAndCourse(
    Title: string,
    CourseTitle: string,
  ): Promise<ChatHistory | null> {
    const groupChat = await this.ChatHistoryModel.findOne({
      Title,
      CourseTitle,
    });
    return groupChat; // Returns null if no group chat is found
  }
}
