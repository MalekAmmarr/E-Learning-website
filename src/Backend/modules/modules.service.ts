import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleSchema } from 'src/schemas/module.schema';
import { CreateModuleDto } from './dto/CreateModuleDto';
import { UpdateModuleDto } from './dto/UpdateModuleDto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name, 'eLearningDB')
    private readonly userinteractionModel: Model<Module>,
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
}
