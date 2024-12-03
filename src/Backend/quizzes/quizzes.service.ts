import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/schemas/quiz.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name, 'eLearningDB') private readonly quizModel: Model<Quiz>,
    @InjectModel(User.name, 'eLearningDB') private readonly userModel: Model<User>,
  ) {}

 // Create a new quiz
 async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
  // Create a new quiz instance
  const quiz = new this.quizModel(createQuizDto);
  // Save the quiz to the database
  return await quiz.save();
}

// Update an existing quiz
async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
  // Find the quiz by its ID and update it
  const updatedQuiz = await this.quizModel.findOneAndUpdate(
    { quizId }, // Find by quizId
    { $set: updateQuizDto }, // Update with the new values
    { new: true } // Return the updated quiz object
  );
  return updatedQuiz;
}
  
}
