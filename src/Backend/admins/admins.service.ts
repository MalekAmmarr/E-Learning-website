import { Injectable,NotFoundException,BadRequestException, } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { admin } from 'src/schemas/admin.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/schemas/user.schema';
import { Instructor } from 'src/schemas/instructor.schema';
import { decrypt } from 'dotenv';
import { Course } from 'src/schemas/course.schema';
import { Logs } from 'src/schemas/logs.schema';

@Injectable()
export class AdminsService {

  // Inject UserModel and AuthenticationLogService into the constructor
  constructor(
    @InjectModel(Course.name,'eLearningDB')
    private readonly courseModel : Model<Course>, // Inject the admin model for DB operations
    @InjectModel(admin.name,'eLearningDB')
    private readonly adminModel : Model<admin>, // Inject the admin model for DB operations
    @InjectModel(Instructor.name, 'eLearningDB')
    private readonly InstructorModel: Model<Instructor>, // Inject the Instructor model for DB operations
    @InjectModel(User.name, 'eLearningDB')
    private readonly UserModel: Model<User>, // Inject the User model for DB operations
    @InjectModel(Logs.name,'eLearningDB')
    private readonly logsModel:Model<Logs>
  ) {}


  async create(createAdminDto: CreateAdminDto): Promise<admin> {
    try{

      if(!createAdminDto.passwordHash){
        throw new Error("Password is required");
      }
      const hashedPassword = await bcrypt.hash(createAdminDto.passwordHash,10);

      const admin = new this.adminModel({
        ...createAdminDto,passwordHash:hashedPassword
      });

      return await admin.save();
    }
    catch(error){

      console.error('Error creating admin:', error);
      throw new Error('Admin registration failed');
    }
  }


  async login(
    email: string,
    passwordHash: string,
  ): Promise<{ accessToken: string ; log:string}> {
    let log = "failed"
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      const accessToken="Invalid Credentials"
       return {accessToken ,log  }
      //throw new NotFoundException('Instrutor not found');
    }
    console.log(admin);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is missing!');
    }
    // Compare the password
    const isPasswordValid = await bcrypt.compare(
      passwordHash,
      admin.passwordHash,
    );
    if (!isPasswordValid) {
      const accessToken="Invalid Credentials"
       return {accessToken ,log }
    }
    log = "pass";

    // Create and return JWT token
    const payload = { name: admin.name, email: admin.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    return { accessToken, log };
  }

}






