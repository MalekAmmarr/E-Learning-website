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

// Start Quiz (Fetch the quiz for the student)
async startQuiz(userEmail: string, quizId: string, courseTitle: string): Promise<Quiz> {
  // Fetch the quiz for the student based on the course title and quiz ID
  const quiz = await this.quizModel
    .findOne({ quizId, courseTitle })
    .exec();

  if (!quiz) {
    throw new Error('Quiz not found for this course');
  }

  return quiz;
}


 // Submit answers (for the student)
 async submitAnswers(userEmail: string, quizId: string, answers: string[]): Promise<void> {
  // Fetch the user based on the email
  const user = await this.userModel.findOne({ email: userEmail }).exec();

  if (!user) {
    throw new Error('Student not found');
  }

  // Fetch the quiz by quizId
  const quiz = await this.quizModel.findOne({ quizId }).exec();

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // Save the student's answers in the quiz
  quiz.studentAnswers = answers;
  await quiz.save();

}


// Grade Quiz (for the instructor)
  async gradeQuiz(instructorEmail: string, quizId: string, studentEmail: string): Promise<void> {
    // Check if the instructor is the one who created the quiz
    const quiz = await this.quizModel
      .findOne({ quizId, instructorEmail })
      .exec();

    if (!quiz) {
      throw new Error('Quiz not found or you are not the creator');
    }

    // Fetch the student by email
    const user = await this.userModel.findOne({ email: studentEmail }).exec();

    if (!user) {
      throw new Error('Student not found');
    }

    // Check if the student's answers exist
    if (quiz.studentAnswers.length === 0) {
      throw new Error('Student has not submitted answers');
    }

    // Grade the answers (assuming a simple score calculation based on correct answers)
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (quiz.studentAnswers[index] === question.correctAnswer) {
        score += 1; // You can adjust the scoring logic as needed
      }
    });

    // Save the grade to the quiz (optional)
    quiz.isGraded = true;
    quiz.studentGrade = score;
    await quiz.save();

    // Save the grade to the student's record (in the User schema)
    user.score = score;
    await user.save();
  }
  
}
