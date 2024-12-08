import { Quiz } from 'src/schemas/quiz.schema';
import { Model } from 'mongoose';
export declare class QuizzesService {
    private readonly userinteractionModel;
    constructor(userinteractionModel: Model<Quiz>);
}
