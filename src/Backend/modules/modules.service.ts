import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleSchema } from 'src/schemas/module.schema';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name, 'eLearningDB')
    private readonly userinteractionModel: Model<Module>,
  ) {}
}
