import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as CourseModule, ModuleSchema } from 'src/schemas/module.schema';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CourseModule.name, schema: ModuleSchema },
        { name: Instructor.name, schema: InstructorSchema }
      ],
      'eLearningDB',
    ),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService]
})
export class ModulesModule {}
