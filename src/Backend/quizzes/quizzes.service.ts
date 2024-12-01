import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/schemas/quiz.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name, 'eLearningDB') private readonly quizModel: Model<Quiz>,
    @InjectModel(User.name, 'eLearningDB') private readonly userModel: Model<User>,
  ) {}


 /* async startQuiz(quizId: string, studentId: Types.ObjectId) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    const student = await this.userModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
  
    if (!quiz.responses.some(response => response.studentId.toString() === studentId.toString())) {
      quiz.responses.push({
        studentId,
        answers: [],
        score: 0,
        submittedAt: new Date(),
      });
      await quiz.save();
    }
  }
  
  // Get questions for a quiz based on student performance
  async getNextQuestion(quizId: string, studentId: Types.ObjectId): Promise<any> {
    const quiz = await this.quizModel.findById(quizId).exec();
    const studentResponse = quiz.responses.find(response => response.studentId.toString() === studentId.toString());

    if (!studentResponse) {
      throw new Error('Student has not started the quiz');
    }

    // Get last answered question
    const lastAnswer = studentResponse.answers[studentResponse.answers.length - 1];

    // Decide difficulty for the next question
    let nextDifficulty: string;

    if (lastAnswer.isCorrect) {
      // If correct answer, move to a harder question
      nextDifficulty = lastAnswer.difficulty === 'easy' ? 'medium' : lastAnswer.difficulty === 'medium' ? 'hard' : 'hard';
    } else {
      // If incorrect answer, move to an easier question
      nextDifficulty = lastAnswer.difficulty === 'hard' ? 'medium' : lastAnswer.difficulty === 'medium' ? 'easy' : 'easy';
    }

    // Find next question based on updated difficulty
    const nextQuestion = quiz.questions.find(question => question.difficulty === nextDifficulty);
    return nextQuestion;
  }

  // Submit answer to a question
  async submitAnswer(studentId: Types.ObjectId, questionId: string, answer: string): Promise<boolean> {
    const quiz = await this.quizModel.findOne({ 'questions.questionId': questionId });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    const studentResponse = quiz.responses.find(response => response.studentId.toString() === studentId.toString());
    if (!studentResponse) {
      throw new NotFoundException('Student has not started the quiz');
    }
  
    const question = quiz.questions.find(q => q.questionId === questionId);
    const isCorrect = answer === question.correctAnswer;
  
    studentResponse.answers.push({
      questionId,
      studentAnswer: answer,
      isCorrect,
      difficulty: question.difficulty,
    });
  
    studentResponse.score += isCorrect ? 1 : 0;
    studentResponse.submittedAt = new Date();
  
    await quiz.save();
    return isCorrect;
  }

  
  async getResults(quizId: string, studentId: Types.ObjectId) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    const studentResponse = quiz.responses.find(response => response.studentId.toString() === studentId.toString());
    if (!studentResponse) {
      throw new NotFoundException('Student has not participated in this quiz');
    }
  
    return {
      score: studentResponse.score,
      answers: studentResponse.answers,
    };
  }*/
  
}
