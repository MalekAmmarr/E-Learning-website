import { Module } from '@nestjs/common';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(

    ),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule { }
