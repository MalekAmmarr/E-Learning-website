import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as CourseModule, ModuleSchema } from 'src/schemas/module.schema';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CourseModule.name, schema: ModuleSchema }], 'eLearningDB'),
  ],
  controllers: [ModulesController],
  providers: [ModulesService]
})
export class ModulesModule {}
