import { Injectable } from '@nestjs/common';
import { Note } from 'src/schemas/note.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from'mongoose';

@Injectable()
export class NoteService {
    constructor(
        @InjectModel(Note.name, 'eLearningDB') private readonly userinteractionModel: Model<Note>) {}
}

