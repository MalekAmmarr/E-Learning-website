import { Document } from 'mongoose';
export declare class Quiz extends Document {
    quizId: string;
    moduleId: string;
    questions: {
        questionId: string;
        questionText: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
    }[];
    difficulty: string;
    responses: {
        studentId: string;
        answers: {
            questionId: string;
            studentAnswer: string;
            isCorrect: boolean;
        }[];
        score: number;
        submittedAt: Date;
    }[];
}
export declare const QuizSchema: import("mongoose").Schema<Quiz, import("mongoose").Model<Quiz, any, any, any, Document<unknown, any, Quiz> & Quiz & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, import("mongoose").FlatRecord<Quiz>> & import("mongoose").FlatRecord<Quiz> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
