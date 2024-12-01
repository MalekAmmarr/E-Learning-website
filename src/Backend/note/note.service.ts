import { Injectable } from '@nestjs/common';
import { Note } from 'src/schemas/note.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name, 'eLearningDB') private readonly noteModel: Model<Note>,
    @InjectModel(User.name, 'eLearningDB') private userModel: Model<User>
  ) {}

  // Ensure that we use ObjectId for queries
 /* async getStudentById(studentId: Types.ObjectId) {
    return await this.userModel.findById(studentId).exec();
  }

  async createNote(createNoteDto: any): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }*/
}
