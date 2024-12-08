import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/schemas/quiz.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { use } from 'passport';

interface Question {
  question: string; // The question text
  options: string[]; // Array of options for the question
  correctAnswer: string; // The correct answer for the question
}

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name, 'eLearningDB')
    private readonly quizModel: Model<Quiz>,
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>,
  ) {}

  // Create a new quiz
  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    // Create a new quiz instance
    const quiz = new this.quizModel(createQuizDto);
    // Save the quiz to the database
    return await quiz.save();
  }

  // Update an existing quiz
  async updateQuiz(
    quizId: string,
    updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    // Find the quiz by its ID and update it
    const updatedQuiz = await this.quizModel.findOneAndUpdate(
      { quizId }, // Find by quizId
      { $set: updateQuizDto }, // Update with the new values
      { new: true }, // Return the updated quiz object
    );
    return updatedQuiz;
  }

  // Start Quiz (Fetch the quiz for the student)
  async startQuiz(
    userEmail: string,
    quizId: string,
    courseTitle: string,
  ): Promise<Question[]> {
    // Fetch the quiz for the student based on the course title and quiz ID
    const quiz = await this.quizModel.findOne({ quizId, courseTitle }).exec();

    if (!quiz) {
      throw new Error('Quiz not found for this course');
    }
    let question = quiz.questions;

    return question;
  }

  // Submit answers (for the student)
  async submitAnswers(
    userEmail: string,
    quizId: string,
    answers: string[],
  ): Promise<void> {
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
    answers.push(userEmail);

    if (quiz.studentAnswers.length == 0) quiz.studentAnswers[0] = answers;
    else quiz.studentAnswers[quiz.studentAnswers.length] = answers;
    await quiz.save();
  }

  // Find quiz by quizId
  async findQuizById(quizId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ quizId });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }
    return quiz;
  }
  async gradeQuiz(
    quizId: string,
    studentEmail: string,

    feedback: string[],
  ): Promise<Quiz> {
    const quiz = await this.findQuizById(quizId);

    if (quiz.isGraded) {
      throw new Error('Quiz has already been graded.');
    }

    // Fetch the user
    const user = await this.userModel.findOne({ email: studentEmail });
    if (!user) {
      throw new NotFoundException(`User with email ${studentEmail} not found`);
    }
    const studentEntry = quiz.studentAnswers.find(
      (entry) => entry[1] === studentEmail,
    );
    const Answers = studentEntry.slice(0, -1);
    // Calculate grade
    let grade = 0;
    const feedbackArray = quiz.questions.map((question, index) => {
      const isCorrect = question.correctAnswer === Answers[index];
      if (isCorrect) grade += 1;

      return {
        question: question.question,
        feedback: feedback[index] || (isCorrect ? 'Correct' : 'Incorrect'),
      };
    });

    const calculatedScore = grade / quiz.questions.length;

    // Update quiz
    await quiz.save();

    // Update user feedback and score
    user.feedback.push({
      quizId,
      courseTitle: quiz.courseTitle,
      feedback: feedbackArray,
    });
    user.score += calculatedScore; // Add quiz grade to user's score
    await user.save();

    return quiz;
  }
}
