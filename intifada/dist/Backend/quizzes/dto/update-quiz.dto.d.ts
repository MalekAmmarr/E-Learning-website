export declare class UpdateQuizDto {
    quizType?: string;
    courseTitle?: string;
    instructorEmail?: string;
    questions?: Array<{
        question: string;
        options: string[];
        correctAnswer: string;
    }>;
    studentAnswers?: string[];
    studentGrade?: number;
    isGraded?: boolean;
}
