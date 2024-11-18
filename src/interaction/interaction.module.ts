import { Module } from '@nestjs/common';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInteraction, UserInteractionSchema } from '../schemas/interaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserInteraction.name, schema: UserInteractionSchema }]),
  ],
  controllers: [InteractionController],
  providers: [InteractionService]
})
export class InteractionModule {}
