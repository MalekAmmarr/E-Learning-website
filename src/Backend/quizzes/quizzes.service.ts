import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/schemas/quiz.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { use } from 'passport';
import { Module as CourseModule } from 'src/schemas/module.schema';

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
    @InjectModel(CourseModule.name, 'eLearningDB') 
    private readonly moduleModel: Model<CourseModule>,
  ) {}

  // Create a new quiz
  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    // Fetch the module for the course
    const module = await this.moduleModel.findOne({ courseTitle: createQuizDto.courseTitle });
    
    if (!module) {
      throw new Error('Module not found for the specified course');
    }

    // Filter questions based on the selected type
    let filteredQuestions = module.questions.filter(question => {
      if (createQuizDto.questionType === 'MCQ' && question.questionType === 'MCQ') {
        return true;
      } else if (createQuizDto.questionType === 'True/False' && question.questionType === 'True/False') {
        return true;
      } else if (createQuizDto.questionType === 'Both') {
        return true;
      }
      return false;
    });

    // Ensure the number of questions is less than or equal to the available questions
    if (filteredQuestions.length < createQuizDto.numberOfQuestions) {
      throw new Error('Not enough questions in the module to create the quiz');
    }

    // Shuffle and select the requested number of questions randomly
    const selectedQuestions = this.getRandomQuestions(filteredQuestions, createQuizDto.numberOfQuestions);

    // Create the quiz object with the selected questions
    const quiz = new this.quizModel({
      ...createQuizDto,
      questions: selectedQuestions,
    });

    // Save the quiz to the database
    return await quiz.save();
  }

  // Helper function to shuffle and select random questions
  private getRandomQuestions(questions: any[], numberOfQuestions: number): any[] {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfQuestions);
  }


  // Update an existing quiz
  async updateQuiz(
    quizId: string,
    updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    // Find the quiz by its ID and update it
    const updatedQuiz = await this.quizModel.findOneAndUpdate(
      { quizId }, // Find by quizId
      {
        $set: updateQuizDto, // Update the quiz with new values
      },
      { new: true, runValidators: true }, // Return the updated quiz object and run validation
    );
  
    // If no quiz is found, throw an error
    if (!updatedQuiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found.`);
    }
  
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
