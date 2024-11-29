import { Module } from '@nestjs/common';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInteraction, UserInteractionSchema } from 'src/schemas/interaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserInteraction.name, schema: UserInteractionSchema }], 'eLearningDB'),
  ],
  controllers: [InteractionController],
  providers: [InteractionService]
})
export class InteractionModule {}
