import { Note } from 'src/schemas/note.schema';
import { Model } from 'mongoose';
export declare class NoteService {
    private readonly userinteractionModel;
    constructor(userinteractionModel: Model<Note>);
}
