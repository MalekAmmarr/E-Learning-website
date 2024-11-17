import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ required: true, unique: true })
  quizId: string;

  @Prop({ required: true })
  moduleId: string;

  @Prop({
    type: [
      {
        questionText: String,
        options: [String],
        correctAnswer: String,
      },
    ],
  })
  questions: {
    questionText: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
