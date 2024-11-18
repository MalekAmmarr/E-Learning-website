import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'submittedAt', updatedAt: false } })
export class Response extends Document {
  @Prop({ required: true, unique: true })
  responseId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  quizId: string;

  @Prop({
    type: [
      {
        questionId: String,
        answer: String,
      },
    ],
    required: true,
  })
  answers: { questionId: string; answer: string }[];

  @Prop({ required: true })
  score: number;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
