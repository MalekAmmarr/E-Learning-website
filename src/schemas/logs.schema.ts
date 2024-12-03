import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class Logs extends Document {

@Prop({ required: true})
  email: string;

@Prop({required:true})
    pass:string;

}

export const LogsSchema = SchemaFactory.createForClass(Logs);