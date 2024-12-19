import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/schemas/quiz.schema';
import * as _ from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { use } from 'passport';
import { Module as CourseModule } from 'src/schemas/module.schema';

import { Instructor } from 'src/schemas/instructor.schema';

import { Progress } from 'src/schemas/progress.schema';

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

    @InjectModel(Instructor.name, 'eLearningDB')
    private readonly instructorModel: Model<Instructor>,
    @InjectModel(Progress.name, 'eLearningDB')
    private readonly progressModel: Model<Progress>,
  ) {}

  // Method to create a quiz based on quizId
  async createQuiz(
    instructorEmail: string,
    quizId: string,
    quizType: string,
    numberOfQuestions: number,
    studentEmail: string,
    courseTitle: string,
  ) {
    // Step 1: Get the module associated with the given quizId
    const module = await this.moduleModel.findOne({ quizId }).exec();
    if (!module) {
      throw new Error(`Module with quizId ${quizId} not found`);
    }

    // Step 2: Get the student data and populate progress
    const student = await this.userModel
      .findOne({ email: studentEmail })
      .exec();

    if (!student) {
      throw new Error(`Student with email ${studentEmail} not found`);
    }

    const progress = await this.progressModel
      .findOne({ studentEmail: studentEmail })
      .exec();

    // Step 3: Determine the student's first quiz grade for the given course
    const firstQuizGrade = progress.score;

    // Step 5: Generate questions for the quiz
    let selectedQuestions = [];
    if (quizType === 'Small') {
      // Small quiz: Select questions evenly from all difficulty levels
      selectedQuestions = this.selectSmallQuizQuestions(
        module.questions,
        numberOfQuestions,
      );
    } else {
      // Midterm or Final quiz: Adjust questions based on difficulty and student's grade
      selectedQuestions = this.selectQuizQuestionsByDifficulty(
        module.questions,
        firstQuizGrade,
        numberOfQuestions,
      );
    }
    const quiz_id = `${module.quizId}-${uuidv4()}`;

    // Step 6: Create the quiz object
    const quiz = new this.quizModel({
      quizId: quiz_id,
      quizType,
      courseTitle: module.courseTitle,
      instructorEmail,
      questions: selectedQuestions,
      studentAnswers: [],
      studentScores: [],
      isGraded: false,
    });

    // Step 7: Save the quiz to the database
    const savedQuiz = await quiz.save();

    return { quiz_id, savedQuiz }; // Return the created quiz
  }

  // Helper method to determine difficulty level based on the first quiz grade

  // Helper method to select questions based on difficulty
  private selectQuizQuestionsByDifficulty(
    questions: any[],
    grade: number,
    numberOfQuestions: number,
  ) {
    let filteredQuestions;
    if (grade < 5) {
      filteredQuestions = questions.filter(
        (q) => q.difficulty === 'easy' || q.difficulty === 'medium',
      );
    } else {
      filteredQuestions = questions.filter(
        (q) => q.difficulty === 'medium' || q.difficulty === 'hard',
      );
    }
    return this.randomSample(filteredQuestions, numberOfQuestions);
  }

  // Select questions for a Small quiz
  private selectSmallQuizQuestions(
    questions: any[],
    numberOfQuestions: number,
  ) {
    const easyQuestions = questions.filter((q) => q.difficulty === 'easy');
    const mediumQuestions = questions.filter((q) => q.difficulty === 'medium');
    const hardQuestions = questions.filter((q) => q.difficulty === 'hard');

    const selectedQuestions = [
      ...this.randomSample(easyQuestions, Math.ceil(numberOfQuestions / 3)),
      ...this.randomSample(mediumQuestions, Math.ceil(numberOfQuestions / 3)),
      ...this.randomSample(hardQuestions, Math.ceil(numberOfQuestions / 3)),
    ];

    return selectedQuestions;
  }

  // Helper function to get a random sample of questions
  private randomSample(arr: any[], size: number) {
    return _.sampleSize(arr, size);
  }


  // Start Quiz (Fetch the quiz for the student)
  async startQuiz(
    userEmail: string,
    quizId: string,
    courseTitle: string,
  ): Promise<any> {
    // Return type can be adjusted depending on the structure you want
    // Fetch the quiz for the student based on the course title and quiz ID, excluding correctAnswer
    const quiz = await this.quizModel
      .findOne({ quizId, courseTitle })
      .select('courseTitle quizId questions') // Select courseTitle, quizId, and questions only
      .exec();

    if (!quiz) {
      throw new Error('Quiz not found for this course');
    }

    // Exclude correctAnswer from each question
    const questionsWithoutAnswers = quiz.questions.map((question) => {
      // Destructure question and exclude the correctAnswer field
      const { correctAnswer, ...questionWithoutAnswer } = question;
      return questionWithoutAnswer;
    });
    // Exclude correctAnswer from each question
    const questionsWithAnswers = quiz.questions.map((question) => {
      // Destructure question and exclude the correctAnswer field
      const { ...questionsWithAnswers } = question;
      return questionsWithAnswers;
    });

    return {
      courseTitle: quiz.courseTitle,
      quizId: quiz.quizId,

      questionsWithAnswers: questionsWithAnswers,
    };
  }

  async submitAnswers(
    userEmail: string,
    quizId: string,
    answers: string[],
    score: number, // Update to use number type for score
    courseTitle: string,
  ): Promise<void> {
    // Fetch the user based on the email
    const user = await this.userModel.findOne({ email: userEmail }).exec();

    if (!user) {
      throw new Error('Student not found');
    }

    // Fetch the quiz by quizId (if needed for additional logic)
    const quiz = await this.quizModel.findOne({ quizId }).exec();

    if (!quiz) {
      throw new Error('Quiz not found');
    }
    // Check if the student has already submitted answers
    const existingEntry = quiz.studentAnswers.find(
      (entry) => entry.studentEmail === userEmail,
    );

    if (existingEntry) {
      // If the student already exists, update their answers
      existingEntry.answers = answers;
    } else {
      // If the student doesn't exist, create a new entry
      quiz.studentAnswers.push({ studentEmail: userEmail, answers });
    }

    // Save the updated quiz
    await quiz.save();

    // Fetch the progress record for the user in the specific course
    let progress = await this.progressModel // Corrected to use progressModel
      .findOne({ studentEmail: userEmail, courseTitle })
      .exec();

    if (!progress) {
      throw new Error('Progress Not Found');
    }
    console.log('Before :', progress.score);
    // Assuming that you want to update the student's score in the progress record:
    progress.score = progress.score + score; // Update score directly
    console.log('After :', progress.score);

    // Save the updated progress and user data
    await progress.save();

    await quiz.save(); // Save updated progress
  }

  // Find quiz by quizId
  async findQuizById(quizId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ quizId });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }
    return quiz;
  }
  async giveFeedback(
    quizId: string,
    studentEmail: string,
    feedback: string[],
  ): Promise<Quiz> {
    const quiz = await this.findQuizById(quizId);

    // Fetch the user
    const user = await this.userModel.findOne({ email: studentEmail });
    if (!user) {
      throw new NotFoundException(`User with email ${studentEmail} not found`);
    }

    // Find the student's answers entry in the quiz using their email
    const studentEntry = quiz.studentAnswers.find(
      (entry) => entry.studentEmail === studentEmail,
    );

    if (!studentEntry) {
      throw new Error(
        `No answers found for student with email: ${studentEmail}`,
      );
    }

    // Extract the answers from the studentEntry
    const answers = studentEntry.answers;

    // Map feedback for each question
    const feedbackArray = answers.map((answer, index) => ({
      question: quiz.questions[index]?.question || 'Unknown Question',
      studentAnswer: answer, // Include student's answer
      feedback: feedback[index] || '', // Instructor's feedback or empty string
    }));

    // Update user feedback
    user.feedback.push({
      quizId,
      courseTitle: quiz.courseTitle,
      feedback: feedbackArray, 
      isfeedbacked: true// Feedback contains question, student's answer, and instructor's feedback
    });

    // Save the updated user data
    await user.save();

    return quiz;
  }

  // Method to fetch all quizzes for a specific course by title
  async getQuizzesByCourseTitle(courseTitle: string): Promise<Quiz[]> {
    return this.quizModel.find({ courseTitle }).exec();
  }

  // Method to fetch only quiz IDs for a specific course
  async getQuizIdsByCourseTitle(courseTitle: string): Promise<string[]> {
    const quizzes = await this.quizModel
      .find({ courseTitle }, { quizId: 1, _id: 0 }) // Projection to return only quizId
      .exec();
    return quizzes.map((quiz) => quiz.quizId); // Extract quizId from each quiz
  }

  // Method to fetch the full quiz content by quizId
  async getQuizById(quizId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ quizId }).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
    }
    return quiz;
  }

  async getQuizzesByInstructor(email: string): Promise<string[]> {
    // Step 1: Find the instructor by email
    const instructor = await this.instructorModel.findOne({ email }).exec();
    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    // Step 2: Get the courses the instructor teaches
    const courses = instructor.Teach_Courses;

    // Step 3: Find quizzes for the courses and return their quizIds
    const quizzes = await this.quizModel
      .find({ courseTitle: { $in: courses } })
      .select('quizId')
      .exec();

    // Extract and return the quizIds
    return quizzes.map((quiz) => quiz.quizId);
  }


  async getStudentAnswers(
    quizId: string,
  ): Promise<{ studentEmail: string; answers: string[]; hasFeedback: boolean }[]> {
    // Find the quiz by quizId
    const quiz = await this.quizModel
      .findOne({ quizId })
      .select('studentAnswers');
  
    // Check if the quiz exists
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    // Fetch users who have provided feedback for this quiz
    const usersWithFeedback = await this.userModel
      .find({ 'feedback.quizId': quizId })
      .select({ email: 1, 'feedback.quizId': 1, _id: 0 });
  
    // Create a set of student emails who have provided feedback
    const feedbackEmails = new Set(usersWithFeedback.map((user) => user.email));
  
    // Map the studentAnswers array to return student email, answers, and feedback status
    const studentEmails = quiz.studentAnswers.map((answer) => ({
      studentEmail: answer.studentEmail,
      answers: answer.answers, // Assuming answers are stored in the answer object
      hasFeedback: feedbackEmails.has(answer.studentEmail), // Check if the email exists in the feedback list
    }));
  
    return studentEmails;
  }


  async getselectedStudentAnswers(
    quizId: string,
    studentEmail: string,
  ): Promise<{ studentEmail: string; answers: string[] }> {
    // Fetch the quiz by its ID, selecting only the studentAnswers field
    const quiz = await this.quizModel
      .findOne({ quizId })
      .select('studentAnswers');

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Search for the student's answers in the studentAnswers array
    const studentAnswer = quiz.studentAnswers.find(
      (answer) => answer.studentEmail === studentEmail,
    );

    if (!studentAnswer) {
      throw new NotFoundException(
        `No answers found for student with email ${studentEmail}`,
      );
    }

    return studentAnswer; // Return the specific student's email and answers
  }
}
