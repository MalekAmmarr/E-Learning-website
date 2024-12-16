import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/schemas/quiz.schema';
import * as _ from 'lodash';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
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

    // Method to create a quiz based on quizId
  async createQuiz(instructorEmail: string, quizId: string, quizType: string, numberOfQuestions: number) {
    // Step 1: Get the module associated with the given quizId
    const module = await this.moduleModel.findOne({ quizId }).exec();
    if (!module) {
      throw new Error(`Module with quizId ${quizId} not found`);
    }

    // Step 2: Get the list of students in the course
    const students = await this.userModel.find({ appliedCourses: module.courseTitle }).exec();
    const courseScores = students.map(student => student.courseScores.find(score => score.courseTitle === module.courseTitle)?.score || 0);
    const averageScore = _.mean(courseScores);

    // Step 3: Generate questions for the quiz based on the quiz type
    let selectedQuestions = [];

    if (quizType === 'Small') {
      // If Small, select questions from each difficulty level
      selectedQuestions = this.selectSmallQuizQuestions(module.questions, numberOfQuestions);
    } else {
      // If Midterm or Final, select questions based on each student's score
      selectedQuestions = this.selectMidtermOrFinalQuizQuestions(module.questions, students, module.courseTitle, numberOfQuestions, averageScore);
    }

    // Step 4: Create the quiz object
    const quiz = new this.quizModel({
      quizId: `quiz_${Date.now()}`,
      quizType,
      courseTitle: module.courseTitle,
      instructorEmail,
      questions: selectedQuestions,
      studentAnswers: [],
      studentScores: [],
      isGraded: false,
    });

    // Step 5: Save the quiz to the database
    const savedQuiz = await quiz.save();

    // Step 6: Update the module to store the quizId (if it's a single quiz per module)
    module.quizId = savedQuiz.quizId; // If you are storing only one quizId per module
    // Or if you want to store multiple quizzes, use:
    // module.quizIds.push(savedQuiz.quizId);

    await module.save(); // Save the updated module with the new quizId

    return savedQuiz; // Return the created quiz
  }

  // Select questions for a Small quiz
  private selectSmallQuizQuestions(questions: any[], numberOfQuestions: number) {
    const easyQuestions = questions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = questions.filter(q => q.difficulty === 'medium');
    const hardQuestions = questions.filter(q => q.difficulty === 'hard');

    const selectedQuestions = [
      ...this.randomSample(easyQuestions, Math.ceil(numberOfQuestions / 3)),
      ...this.randomSample(mediumQuestions, Math.ceil(numberOfQuestions / 3)),
      ...this.randomSample(hardQuestions, Math.ceil(numberOfQuestions / 3)),
    ];

    return selectedQuestions;
  }

  // Select questions for Midterm or Final quizzes
  private selectMidtermOrFinalQuizQuestions(questions: any[], students: User[], courseTitle: string, numberOfQuestions: number, averageScore: number) {
    let selectedQuestions = [];

    students.forEach(student => {
      const studentScore = student.courseScores.find(score => score.courseTitle === courseTitle)?.score || 0;
      const difficultyLevel = studentScore < averageScore ? 'easy' :
                              studentScore === averageScore ? 'medium' : 'hard';
      
      const filteredQuestions = questions.filter(q => q.difficulty === difficultyLevel);
      const studentQuestions = this.randomSample(filteredQuestions, Math.ceil(numberOfQuestions / students.length));
      selectedQuestions = [...selectedQuestions, ...studentQuestions];
    });

    // Shuffle and return selected questions
    return _.shuffle(selectedQuestions);
  }

  // Helper function to get a random sample of questions
  private randomSample(arr: any[], size: number) {
    return _.sampleSize(arr, size);
  }


 // Method to update the quiz content
 async updateQuiz(quizId: string, updateData: any) {
  // Step 1: Find the quiz by quizId
  const quiz = await this.quizModel.findOne({ quizId }).exec();
  if (!quiz) {
    throw new Error(`Quiz with quizId ${quizId} not found`);
  }

  // Step 2: Update the quiz fields (e.g., questions, quiz type, etc.)
  if (updateData.quizType) {
    quiz.quizType = updateData.quizType;
  }
  if (updateData.questions) {
    quiz.questions = updateData.questions; // Assuming questions is an array of questions
  }
  if (updateData.isGraded !== undefined) {
    quiz.isGraded = updateData.isGraded;
  }

  // Step 3: Save the updated quiz
  await quiz.save();

  // Return the updated quiz
  return quiz;
}
  

  // Start Quiz (Fetch the quiz for the student)
  async startQuiz(
    userEmail: string,
    quizId: string,
    courseTitle: string,
  ): Promise<any> {  // Return type can be adjusted depending on the structure you want
    // Fetch the quiz for the student based on the course title and quiz ID, excluding correctAnswer
    const quiz = await this.quizModel
      .findOne({ quizId, courseTitle })
      .select('courseTitle quizId questions')  // Select courseTitle, quizId, and questions only
      .exec();
  
    if (!quiz) {
      throw new Error('Quiz not found for this course');
    }
  
    // Exclude correctAnswer from each question
    const questionsWithoutAnswers = quiz.questions.map(question => {
      // Destructure question and exclude the correctAnswer field
      const { correctAnswer, ...questionWithoutAnswer } = question;
      return questionWithoutAnswer;
    });
  
    return {
      courseTitle: quiz.courseTitle,
      quizId: quiz.quizId,
      questions: questionsWithoutAnswers,
    };
  }
  

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
  
    // Check if the student has already submitted answers
    const existingEntry = quiz.studentAnswers.find(entry => entry.studentEmail === userEmail);
    
    if (existingEntry) {
      // If the student already exists, update their answers
      existingEntry.answers = answers;
    } else {
      // If the student doesn't exist, create a new entry
      quiz.studentAnswers.push({ studentEmail: userEmail, answers });
    }
  
    // Save the updated quiz
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
  
    // Find the student's answers entry in the quiz using their email
    const studentEntry = quiz.studentAnswers.find(
      (entry) => entry.studentEmail === studentEmail,
    );
  
    if (!studentEntry) {
      throw new Error(`No answers found for student with email: ${studentEmail}`);
    }
  
    // Extract the answers from the studentEntry
    const answers = studentEntry.answers;
  
    // Calculate grade
    let grade = 0;
    const feedbackArray = quiz.questions.map((question, index) => {
      const isCorrect = question.correctAnswer === answers[index];
      if (isCorrect) grade += 1;
  
      return {
        question: question.question,
        feedback: feedback[index] || (isCorrect ? 'Correct' : 'Incorrect'),
      };
    });
  
    const calculatedScore = grade / quiz.questions.length;
  
    // Update quiz status to graded
    quiz.isGraded = true;
    await quiz.save();
  
    // Update user feedback
    user.feedback.push({
      quizId,
      courseTitle: quiz.courseTitle,
      feedback: feedbackArray,
    });
  
    // Find the course in the user's accepted courses and update their score
    const courseIndex = user.acceptedCourses.indexOf(quiz.courseTitle);
    if (courseIndex !== -1) {
      // Find the student's score entry for the course in the courseScores array
      const courseScoreIndex = user.courseScores.findIndex(
        (scoreEntry) => scoreEntry.courseTitle === quiz.courseTitle,
      );
  
      if (courseScoreIndex !== -1) {
        // Update the score for the specific course
        user.courseScores[courseScoreIndex].score += grade;
      } else {
        // If the course doesn't exist in courseScores, add it with the calculated score
        user.courseScores.push({
          courseTitle: quiz.courseTitle,
          score: calculatedScore,
        });
      }
    } else {
      throw new Error(`Student is not accepted into course: ${quiz.courseTitle}`);
    }
  
    // Update GPA: Calculate average score from all courseScores
    const totalScore = user.courseScores.reduce((sum, entry) => sum + entry.score, 0);
    const gpa = totalScore / user.courseScores.length;
  
    // Update the user's GPA
    user.GPA = gpa;
  
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
    return quizzes.map(quiz => quiz.quizId); // Extract quizId from each quiz
  }

  // Method to fetch the full quiz content by quizId
  async getQuizById(quizId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ quizId }).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
    }
    return quiz;
  }
  
  
  
}
