import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleSchema } from 'src/schemas/module.schema';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { UpdateModuleDto } from './dto/UpdateModuleDto';
import { Instructor } from 'src/schemas/instructor.schema';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name, 'eLearningDB')
    private readonly userinteractionModel: Model<Module>,
    @InjectModel(Instructor.name, 'eLearningDB')
    private readonly instructorModel: Model<Instructor>,
  ) {}


  async createModule(createModuleDto: CreateModuleDto): Promise<Module> {
    const { quizId, courseTitle, instructorEmail, quizType, questionTypes, questions } = createModuleDto;

    // Validate question types
    if (questions.some(q => q.questionType !== 'MCQ' && q.questionType !== 'True/False')) {
      throw new BadRequestException('Invalid question type provided.');
    }

    // Validate options for True/False questions
    if (questions.some(q => q.questionType === 'True/False' && q.options.length !== 2)) {
      throw new BadRequestException('True/False questions must have exactly two options.');
    }

    const newModule = new this.userinteractionModel({
      quizId,
      courseTitle,
      instructorEmail,
      quizType,
      questionTypes,
      questions,
    });

    return await newModule.save();
  }


  async updateModule(quizId: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const module = await this.userinteractionModel.findOne({ quizId });

    if (!module) {
      throw new NotFoundException(`Module with quizId ${quizId} not found.`);
    }

    const { questions } = updateModuleDto;

    // Validate question types
    if (questions?.some(q => q.questionType !== 'MCQ' && q.questionType !== 'True/False')) {
      throw new BadRequestException('Invalid question type provided.');
    }

    // Validate options for True/False questions
    if (questions?.some(q => q.questionType === 'True/False' && q.options.length !== 2)) {
      throw new BadRequestException('True/False questions must have exactly two options.');
    }

    Object.assign(module, updateModuleDto);

    return await module.save();
  }

  async deleteModule(quizId: string): Promise<void> {
    
    const result = await this.userinteractionModel.deleteOne({ quizId });
  
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Module with course title "${quizId}" not found.`
      );
    }
  }
  

  async getQuizIdAndCourseTitleByInstructorEmail(
    instructorEmail: string
  ): Promise<{ quizId: string; courseTitle: string }[]> {
    // Fetch the instructor's Teach_Courses based on their email
    const instructor = await this.instructorModel
      .findOne({ email: instructorEmail }, { Teach_Courses: 1, _id: 0 })
      .exec();
  
    if (!instructor) {
      throw new Error('Instructor not found');
    }
  
    const { Teach_Courses } = instructor;
  
    // Fetch quizzes for the courses the instructor teaches
    const quizzes = await this.userinteractionModel
      .find(
        { courseTitle: { $in: Teach_Courses } }, // Filter by courses the instructor teaches
        { quizId: 1, courseTitle: 1, _id: 0 } // Projection to return quizId and courseTitle
      )
      .exec();
  
    return quizzes.map((quiz) => ({
      quizId: quiz.quizId,
      courseTitle: quiz.courseTitle,
    }));
  }

  async getModuleDetailsByQuizId(quizId: string): Promise<Module> {
    if (!quizId) {
      throw new NotFoundException('Quiz ID is required');
    }

    const moduleDetails = await this.userinteractionModel.findOne({ quizId });

    if (!moduleDetails) {
      throw new NotFoundException(`Module with Quiz ID ${quizId} not found`);
    }

    return moduleDetails;
  }
  
}
