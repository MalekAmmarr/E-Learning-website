export declare class CreateQuizDto {
    quizId: string;
    quizType: string;
    courseTitle: string;
    instructorEmail: string;
    questions: Array<{
        question: string;
        options: string[];
        correctAnswer: string;
    }>;
    studentAnswers?: string[];
    studentGrade?: number;
}
