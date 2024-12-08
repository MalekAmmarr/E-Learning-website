import { Model } from 'mongoose';
import { Module } from 'src/schemas/module.schema';
export declare class ModulesService {
    private readonly userinteractionModel;
    constructor(userinteractionModel: Model<Module>);
}
